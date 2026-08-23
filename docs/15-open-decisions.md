# Open Decisions / Do Not Invent

The following are intentionally not fully specified and require product/engineering sign-off before implementation if they materially affect architecture:

1. Final stack: framework, database, hosting, queue/event platform.
2. Exact POS local client approach: PWA, desktop shell, native Android, or hybrid.
3. Local multi-terminal synchronization protocol.
4. Exact printer protocols and supported models.
5. Payment providers at launch.
6. Exact Swiggy/Zomato API/partner capabilities.
7. GST/tax compliance implementation and accountant review.
8. Trial length and dunning/grace period.
9. Exact Growth/Pro plan entitlements.
10. Exact game catalog and game-economy rules.
11. Messaging vendors and regional cost assumptions.
12. Data retention periods.
13. Cloud region and disaster-recovery targets.
14. Customer consent language and notification preferences.
15. Merchant terms regarding customer data ownership/export.

Rule: unresolved product questions must become GitHub issues or ADRs. Do not silently invent business behavior.
