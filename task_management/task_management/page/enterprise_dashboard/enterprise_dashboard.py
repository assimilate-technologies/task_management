from __future__ import unicode_literals
import frappe


@frappe.whitelist()
def get_dashboard_data():

    total_tasks = frappe.db.count("Tasks")

    completed_tasks = frappe.db.count(
        "Tasks",
        {
            "priority": "Completed"
        }
    )

    overdue_tasks = frappe.db.sql("""
        SELECT COUNT(*)
        FROM `tabTasks`
        WHERE delayed_by > 0
        AND priority != 'Completed'
    """)[0][0]

    critical_tasks = frappe.db.sql("""
        SELECT COUNT(*)
        FROM `tabTasks`
        WHERE delayed_by >= 15
        AND priority != 'Completed'
    """)[0][0]

    return {
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "overdue_tasks": overdue_tasks,
        "critical_tasks": critical_tasks
    }


@frappe.whitelist()
def get_priority_data():

    return frappe.db.sql("""
        SELECT
            priority,
            COUNT(*) as count
        FROM `tabTasks`
        GROUP BY priority
    """, as_dict=True)


@frappe.whitelist()
def get_delayed_tasks():

    return frappe.db.sql("""
        SELECT
            name,
            task_name,
            delayed_by
        FROM `tabTasks`
        WHERE delayed_by > 0
        ORDER BY delayed_by DESC
    """, as_dict=True)
# from __future__ import unicode_literals
# import frappe


# @frappe.whitelist()
# def get_dashboard_data():

#     user = frappe.session.user
#     user_roles = frappe.get_roles(user)

#     # Manager / Admin sees all data
#     if (
#         "System Manager" in user_roles
#         or "Task Manager" in user_roles
#     ):

#         total_tasks = frappe.db.count("Tasks")

#         completed_tasks = frappe.db.count(
#             "Tasks",
#             {
#                 "priority": "Completed"
#             }
#         )

#         overdue_tasks = frappe.db.sql("""
#             SELECT COUNT(*)
#             FROM `tabTasks`
#             WHERE delayed_by > 0
#             AND priority != 'Completed'
#         """)[0][0]

#         critical_tasks = frappe.db.sql("""
#             SELECT COUNT(*)
#             FROM `tabTasks`
#             WHERE delayed_by >= 15
#             AND priority != 'Completed'
#         """)[0][0]

#     # Employee sees only their tasks
#     else:

#         total_tasks = frappe.db.count(
#             "Tasks",
#             {
#                 "assigned_to": user
#             }
#         )

#         completed_tasks = frappe.db.count(
#             "Tasks",
#             {
#                 "assigned_to": user,
#                 "priority": "Completed"
#             }
#         )

#         overdue_tasks = frappe.db.count(
#             "Tasks",
#             {
#                 "assigned_to": user,
#                 "delayed_by": [">", 0],
#                 "priority": ["!=", "Completed"]
#             }
#         )

#         critical_tasks = frappe.db.count(
#             "Tasks",
#             {
#                 "assigned_to": user,
#                 "delayed_by": [">=", 15],
#                 "priority": ["!=", "Completed"]
#             }
#         )

#     return {
#         "total_tasks": total_tasks,
#         "completed_tasks": completed_tasks,
#         "overdue_tasks": overdue_tasks,
#         "critical_tasks": critical_tasks
#     }


# @frappe.whitelist()
# def get_priority_data():

#     user = frappe.session.user
#     user_roles = frappe.get_roles(user)

#     # Manager sees all
#     if (
#         "System Manager" in user_roles
#         or "Task Manager" in user_roles
#     ):

#         return frappe.db.sql("""
#             SELECT
#                 priority,
#                 COUNT(*) as count
#             FROM `tabTasks`
#             GROUP BY priority
#         """, as_dict=True)

#     # Employee sees own
#     return frappe.db.sql("""
#         SELECT
#             priority,
#             COUNT(*) as count
#         FROM `tabTasks`
#         WHERE assigned_to = %s
#         GROUP BY priority
#     """, (user,), as_dict=True)