# Git Commands: Create Safe Multi-Language Branch

## Current Status
You have uncommitted changes:
- `app/api/info/route.ts`
- `app/api/itinerary/route.ts`
- `app/dashboard/page.tsx`
- `components/InfoList.tsx`
- `components/ItineraryCard.tsx`
- `MULTILANG_WORKFLOW.md` (new file)

## Option 1: Commit Changes Then Create Branch (Recommended)

```bash
# Step 1: Stage all changes
git add .

# Step 2: Commit with descriptive message
git commit -m "feat: Complete multi-language display logic and API cache-busting

- Fix ItineraryCard with explicit Chinese display logic and debug logs
- Fix InfoList to re-fetch on language change  
- Add cache-busting headers to all APIs (tasks, itinerary, info)
- Ensure all components respect language context
- Add workflow documentation"

# Step 3: Create and switch to new branch
git checkout -b feature/multi-lang-v2

# Step 4: Verify you're on the new branch
git branch
```

## Option 2: Stash Changes, Create Branch, Then Apply Changes

```bash
# Step 1: Stash current changes
git stash push -m "WIP: Multi-language fixes"

# Step 2: Create and switch to new branch
git checkout -b feature/multi-lang-v2

# Step 3: Apply stashed changes to the new branch
git stash pop

# Step 4: Commit on the new branch
git add .
git commit -m "feat: Complete multi-language display logic and API cache-busting"
```

## Option 3: Create Branch from Current State (Keep Changes Uncommitted)

```bash
# Create and switch to new branch (keeps uncommitted changes)
git checkout -b feature/multi-lang-v2

# Verify branch
git branch

# Later, commit when ready:
git add .
git commit -m "feat: Complete multi-language display logic"
```

## After Creating Branch

Once on `feature/multi-lang-v2`, you can safely:
- Make experimental changes
- Test multi-language features
- Break things without affecting `main` branch

## Architecture Reminders

✅ **Already Implemented:**
- LanguageContext (`context/LanguageContext.tsx`)
- Database columns (`title_zh`, `description_zh`, `content_zh`)
- Translation Manager (`app/dashboard/translation-manager/page.tsx`)
- Translation API (`app/api/admin/translate-row/route.ts`)

🔧 **Future Work:**
- Create `/api/admin/sync-translations` for batch translation
- Separate "Editing" (fast) from "Translating" (slow, async)



