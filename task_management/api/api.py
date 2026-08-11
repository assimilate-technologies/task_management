import frappe

def create_task_user_permission(doc, method):

    # Remove existing permissions for this task
    existing_permissions = frappe.get_all(
        "User Permission",
        filters={
            "allow": "Tasks",
            "for_value": doc.name
        },
        fields=["name"]
    )

    for permission in existing_permissions:
        frappe.delete_doc(
            "User Permission",
            permission.name,
            ignore_permissions=True,
            force=True
        )

    # Create permissions for currently assigned employees
    for row in doc.assigned_to:

        if not row.employee:
            continue

        employee = frappe.get_doc("Employee", row.employee)

        if not employee.user_id:
            continue

        frappe.get_doc({
            "doctype": "User Permission",
            "user": employee.user_id,
            "allow": "Tasks",
            "for_value": doc.name,
            "apply_to_all_doctypes": 1
        }).insert(ignore_permissions=True)
# import frappe


# def create_task_user_permission(doc, method):
#     """
#     Create User Permission for all employees assigned to a task.
#     """

#     if not doc.assigned_to:
#         return

#     for row in doc.assigned_to:

#         if not row.employee:
#             continue

#         try:
#             employee = frappe.get_doc("Employee", row.employee)

#             if not employee.user_id:
#                 continue

#             user = employee.user_id

#             exists = frappe.db.exists(
#                 "User Permission",
#                 {
#                     "user": user,
#                     "allow": "Tasks",
#                     "for_value": doc.name
#                 }
#             )

#             if not exists:
#                 frappe.get_doc({
#                     "doctype": "User Permission",
#                     "user": user,
#                     "allow": "Tasks",
#                     "for_value": doc.name,
#                     "apply_to_all_doctypes": 1
#                 }).insert(ignore_permissions=True)

#         except Exception:
#             frappe.log_error(
#                 frappe.get_traceback(),
#                 f"Task Permission Creation Failed for Employee {row.employee}"
#             )