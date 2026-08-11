# import frappe
# from frappe.utils import date_diff, today

# @frappe.whitelist()
# def update_status(name, status):
#     """
#     API endpoint to update task status and recalculate delays.
#     Logic copied from tasks.py controller.
#     """
#     doc = frappe.get_doc("Tasks", name)
#     doc.status = status
    
#     # Calculate total days since reporting
#     if doc.reporting_date:
#         doc.days = date_diff(today(), doc.reporting_date)
#     else:
#         doc.days = 0

#     # Calculate delayed_by (only if not completed)
#     if doc.expected_resolution_date and doc.status not in ["Completed", "Closed", "Moved to Production"]:
#         delay = date_diff(today(), doc.expected_resolution_date)
#         doc.delayed_by = max(0, delay)
#     else:
#         doc.delayed_by = 0
        
#     doc.save()
#     frappe.db.commit()
    
#     return {
#         "status": doc.status,
#         "days": doc.days,
#         "delayed_by": doc.delayed_by
#     }
