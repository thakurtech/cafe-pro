# Merchant Migration Plan

## Goal
Make replacing legacy restaurant software low-risk.

## Migration modes
1. Fresh setup.
2. Import and parallel run.
3. Full cutover.

## Data import categories
- business profile
- outlets
- categories
- products
- prices
- modifiers
- tax configuration
- recipes
- tables
- customers where export is available
- staff
- opening inventory where supported

## Migration wizard
1. Connect/upload source.
2. Detect entities.
3. Map fields.
4. Show exceptions.
5. Validate.
6. Preview.
7. Import test dataset.
8. Merchant confirms.
9. Final import.
10. Parallel validation.
11. Cutover.

## Success criteria
- No duplicate products caused by migration.
- Historical price snapshots remain correct.
- Test order works before cutover.
- Critical data exception count is zero or explicitly accepted.
