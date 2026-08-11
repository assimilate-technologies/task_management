# Copyright (c) 2026, Assimilator and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.utils import add_days
def execute(filters=None):
    columns = get_columns()
    data = get_data(filters)
    
    chart = get_chart(data)
    
    return columns, data, None, chart

def get_columns():
    return [
        {
            "label": _("Task ID"),
            "fieldname": "name",
            "fieldtype": "Link",
            "options": "Tasks",
            "width": 150
        },
        {
            "label": _("Task Name"),
            "fieldname": "task_name",
            "fieldtype": "Data",
            "width": 250
        },
        {
            "label": _("Expected Resolution Date"),
            "fieldname": "expected_resolution_date",
            "fieldtype": "Date",
            "width": 150
        },
        {
            "label": _("Days Remaining"),
            "fieldname": "days_remaining",
            "fieldtype": "Int",
            "width": 120
        },
        {
            "label": _("Priority"),
            "fieldname": "priority",
            "fieldtype": "Data",
            "width": 150
        },
        {
            "label": _("Status"),
            "fieldname": "status",
            "fieldtype": "Data",
            "width": 150
        }
    ]
def get_data(filters=None):

    from frappe.utils import date_diff, today, add_days

    days_filter = 7

    if filters and filters.get("days"):
        days_filter = int(filters.get("days"))

    tasks = frappe.get_all(
        "Tasks",
        fields=[
            "name",
            "task_name",
            "expected_resolution_date",
            "priority",
            "status"
        ],
        filters={
            "expected_resolution_date": [
                "between",
                [today(), add_days(today(), days_filter)]
            ]
        },
        order_by="expected_resolution_date asc",
        limit=50
    )

    for task in tasks:
        task.days_remaining = date_diff(
            task.expected_resolution_date,
            today()
        )

    return tasks
# def get_data(filters=None):
#     from frappe.utils import date_diff, today
    
#     # Fetch all pending tasks with a resolution date
#     # Removed status filter to ensure we see all tasks
#     tasks = frappe.get_all("Tasks", 
#         fields=["name","task_name", "expected_resolution_date", "priority", "status"],
#         filters={
#             "expected_resolution_date": ["between",
#                                         [today(), add_days(today(), days_filter)]]
#         },
#         order_by="expected_resolution_date asc",
#         limit=50
#     )
    
#     for task in tasks:
#         task.days_remaining = date_diff(task.expected_resolution_date, today())
            
#     return tasks

def get_chart(data):
    if not data:
        return None
        
    labels = [d.get("name") for d in data]
    values = [d.get("days_remaining") for d in data]
    
    return {
        "data": {
            "labels": labels,
            "datasets": [
                {
                    "name": _("Days Remaining"),
                    "values": values
                }
            ]
        },
        "type": "bar",
        "colors": ["#3498db"]
    }
