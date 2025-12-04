# Multi-Language Development Workflow Guide

## 🚀 Step 1: Create Safe Branch

### Option A: Use Existing Branch (if you want to continue previous work)
```bash
# Commit current changes first
git add .
git commit -m "WIP: Itinerary Chinese display fixes"

# Switch to existing branch
git checkout feature/multilang-v2

# If branch is outdated, merge latest main
git merge main
```

### Option B: Create Fresh Branch (Recommended for clean start)
```bash
# First, commit or stash current changes
git add .
git commit -m "WIP: Itinerary Chinese display fixes"

# Create and switch to new branch
git checkout -b feature/multilang-v2

# Or if you want to start from a clean main:
git stash
git checkout main
git checkout -b feature/multilang-v2
git stash pop  # Apply your changes to the new branch
```

## 📋 Step 2: Architecture Overview

### Current State ✅
- **LanguageContext**: Already implemented (`context/LanguageContext.tsx`)
  - Supports: `'vi'` | `'zh-TW'`
  - Persists selection in localStorage
- **Database Schema**: Already has `title_zh`, `description_zh`, `content_zh` columns
- **Translation Manager**: Already exists (`app/dashboard/translation-manager/page.tsx`)
- **Translation API**: Already exists (`app/api/admin/translate-row/route.ts`)

### What Needs Work 🔧

1. **Component Display Logic** (In Progress)
   - ✅ `TaskCard.tsx` - Fixed
   - ✅ `ItineraryCard.tsx` - Fixed (with debug logs)
   - ✅ `InfoCard.tsx` - Fixed
   - ⚠️ Verify all components respect `language` state

2. **Data Fetching** (In Progress)
   - ✅ `TaskList.tsx` - Re-fetches on language change
   - ✅ `app/dashboard/page.tsx` - Re-fetches itinerary on language change
   - ⚠️ Verify `InfoList.tsx` also re-fetches on language change

3. **API Cache Busting** (In Progress)
   - ✅ `/api/tasks` - Cache headers added
   - ✅ `/api/itinerary` - Cache headers added
   - ⚠️ Verify `/api/info` also has cache headers

4. **Batch Translation Endpoint** (Future Enhancement)
   - Create `/api/admin/sync-translations` for bulk translation
   - Separate "Editing" (fast) from "Translating" (slow, async)

## 🎯 Step 3: Testing Checklist

After switching to the branch, test:

- [ ] Language switcher in Navbar works
- [ ] Tasks display Chinese when `zh-TW` is selected
- [ ] Itinerary displays Chinese when `zh-TW` is selected
- [ ] Info cards display Chinese when `zh-TW` is selected
- [ ] Translation Manager can translate individual rows
- [ ] Translation Manager can batch translate empty rows
- [ ] Switching languages triggers data re-fetch
- [ ] Browser console shows debug logs for Itinerary items

## 🔄 Step 4: Safe Development Process

1. **Make Changes**: Work on `feature/multilang-v2` branch
2. **Test Locally**: Verify all functionality works
3. **Commit Regularly**: `git commit -m "feat: description"`
4. **Merge When Ready**: 
   ```bash
   git checkout main
   git merge feature/multilang-v2
   git push origin main
   ```

## 📝 Current Git Status

You have uncommitted changes:
- `app/api/itinerary/route.ts`
- `app/dashboard/page.tsx`
- `components/ItineraryCard.tsx`

**Recommended Action**: Commit these changes before switching branches.



