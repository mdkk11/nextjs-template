#!/usr/bin/env bash

set -euo pipefail

die() {
  printf 'setup:repo: %s\n' "$1" >&2
  exit 1
}

command -v gh >/dev/null 2>&1 || die "GitHub CLI (gh) is required."
command -v jq >/dev/null 2>&1 || die "jq is required."

repo_root=$(git rev-parse --show-toplevel 2>/dev/null) ||
  die "not inside a Git repository; run this command from a GitHub clone."
cd "$repo_root"

gh auth status >/dev/null 2>&1 ||
  die "GitHub CLI is not authenticated; run gh auth login first."

repo_metadata=$(gh repo view --json nameWithOwner,defaultBranchRef 2>/dev/null) ||
  die "could not resolve the GitHub repository from this clone."
repo=$(jq -r '.nameWithOwner // empty' <<<"$repo_metadata")
default_branch=$(jq -r '.defaultBranchRef.name // empty' <<<"$repo_metadata")
[[ -n "$repo" && -n "$default_branch" ]] ||
  die "the GitHub repository has no resolvable default branch."

api_version=2026-03-10
gh_api() {
  gh api "$@" \
    -H 'Accept: application/vnd.github+json' \
    -H "X-GitHub-Api-Version: $api_version"
}

repo_json=$(gh_api "repos/$repo") || die "could not read repository settings."
[[ "$(jq -r '.permissions.admin // false' <<<"$repo_json")" == true ]] ||
  die "the authenticated account needs repository administration permission."

# Read rulesets before changing anything so missing ruleset access fails safely.
rulesets_json=$(gh_api --paginate --slurp "repos/$repo/rulesets?includes_parents=false&per_page=100") ||
  die "could not read repository rulesets; check ruleset administration permission."

desired_repo=$(jq -n '{
  delete_branch_on_merge: true,
  allow_squash_merge: true,
  allow_merge_commit: false,
  allow_rebase_merge: false
}')

repo_state=$(jq -S '{
  delete_branch_on_merge,
  allow_squash_merge,
  allow_merge_commit,
  allow_rebase_merge
}' <<<"$repo_json")

if [[ "$repo_state" != "$(jq -S . <<<"$desired_repo")" ]]; then
  gh_api --method PATCH "repos/$repo" --input - <<<"$desired_repo" >/dev/null
fi

ruleset_name='Protect Default Branch'
desired_ruleset=$(jq -n --arg name "$ruleset_name" '{
  name: $name,
  target: "branch",
  enforcement: "active",
  bypass_actors: [],
  conditions: {
    ref_name: {
      include: ["~DEFAULT_BRANCH"],
      exclude: []
    }
  },
  rules: [
    { type: "deletion" },
    { type: "non_fast_forward" },
    {
      type: "pull_request",
      parameters: {
        allowed_merge_methods: ["squash"],
        dismiss_stale_reviews_on_push: false,
        require_code_owner_review: false,
        require_last_push_approval: false,
        required_approving_review_count: 0,
        required_review_thread_resolution: false
      }
    },
    {
      type: "required_status_checks",
      parameters: {
        do_not_enforce_on_create: true,
        required_status_checks: [
          { context: "quality" },
          { context: "test" },
          { context: "build" }
        ],
        strict_required_status_checks_policy: false
      }
    }
  ]
}')

canonicalize_ruleset() {
  jq -S '
    {
      name,
      target,
      enforcement,
      bypass_actors: (
        (.bypass_actors // [])
        | map({ actor_id, actor_type, bypass_mode })
        | sort_by(.actor_type, .actor_id, .bypass_mode)
      ),
      conditions: {
        ref_name: {
          include: ((.conditions.ref_name.include // []) | sort),
          exclude: ((.conditions.ref_name.exclude // []) | sort)
        }
      },
      rules: (
        (.rules // [])
        | map(
            if .type == "deletion" or .type == "non_fast_forward" then
              { type }
            elif .type == "pull_request" then
              {
                type,
                parameters: {
                  allowed_merge_methods: (.parameters.allowed_merge_methods | sort),
                  dismiss_stale_reviews_on_push: .parameters.dismiss_stale_reviews_on_push,
                  require_code_owner_review: .parameters.require_code_owner_review,
                  require_last_push_approval: .parameters.require_last_push_approval,
                  required_approving_review_count: .parameters.required_approving_review_count,
                  required_review_thread_resolution: .parameters.required_review_thread_resolution
                }
              }
            elif .type == "required_status_checks" then
              {
                type,
                parameters: {
                  do_not_enforce_on_create: .parameters.do_not_enforce_on_create,
                  required_status_checks: (
                    .parameters.required_status_checks
                    | map(
                        if .integration_id == null then
                          { context }
                        else
                          { context, integration_id }
                        end
                      )
                    | sort_by(.context, .integration_id)
                  ),
                  strict_required_status_checks_policy: .parameters.strict_required_status_checks_policy
                }
              }
            else
              { type, parameters }
            end
          )
        | sort_by(.type)
      )
    }
  '
}

ruleset_id=$(jq -r --arg name "$ruleset_name" '.[][]? | select(.name == $name) | .id' <<<"$rulesets_json" | head -n 1)

if [[ -n "$ruleset_id" ]]; then
  current_ruleset=$(gh_api "repos/$repo/rulesets/$ruleset_id?includes_parents=false")
  current_state=$(canonicalize_ruleset <<<"$current_ruleset")
  desired_state=$(canonicalize_ruleset <<<"$desired_ruleset")

  if [[ "$current_state" != "$desired_state" ]]; then
    # GitHub's current repository-ruleset endpoint replaces a ruleset with PUT.
    gh_api --method PUT "repos/$repo/rulesets/$ruleset_id" --input - <<<"$desired_ruleset" >/dev/null
  fi
else
  gh_api --method POST "repos/$repo/rulesets" --input - <<<"$desired_ruleset" >/dev/null
fi

printf 'Applied repository settings and ruleset "%s" to %s (default branch: %s).\n' \
  "$ruleset_name" "$repo" "$default_branch"
