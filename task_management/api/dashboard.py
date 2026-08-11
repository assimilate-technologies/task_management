import frappe


@frappe.whitelist()
def get_dashboard_stats():

    # Total Tasks
    total_tasks = frappe.db.count("Tasks")

    # Completed Tasks
    completed_tasks = frappe.db.count(
        "Tasks",
        {
            "priority": "Completed"
        }
    )

    # Overdue Tasks
    overdue_tasks = frappe.db.sql("""
        SELECT COUNT(*)
        FROM `tabTasks`
        WHERE expected_resolution_date < CURDATE()
        AND priority != 'Completed'
    """)[0][0]

    # Critical Tasks (Delayed 15+ days)
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