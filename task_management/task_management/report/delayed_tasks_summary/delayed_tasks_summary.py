# Copyright (c) 2026, Assimilator and contributors

import frappe
from frappe import _


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
            "label": _("Delay Bucket"),
            "fieldname": "delay_bucket",
            "fieldtype": "Data",
            "width": 150
        },

        {
            "label": _("Days Delayed"),
            "fieldname": "delayed_by",
            "fieldtype": "Int",
            "width": 120
        }

    ]


def get_data(filters=None):

    delay_range = filters.get("delay_range") if filters else "All"

    tasks = frappe.get_all(
        "Tasks",
        fields=[
            "name",
            "task_name",
            "delayed_by",
            "status"
        ],
        filters={
            "delayed_by": [">", 0],
            "status": ["not in", ["Completed", "Closed"]]
        },
        order_by="delayed_by desc"
    )

    report_data = []

    for task in tasks:

        delayed = task.delayed_by or 0

        if 1 <= delayed <= 5:
            bucket_name = "0-5 Days"

        elif 6 <= delayed <= 10:
            bucket_name = "5-10 Days"

        elif 11 <= delayed <= 15:
            bucket_name = "10-15 Days"

        else:
            bucket_name = "15+ Days"

        if delay_range != "All":

            if bucket_name != delay_range:
                continue

        report_data.append({
            "name": task.name,
            "task_name": task.task_name,
            "delay_bucket": bucket_name,
            "delayed_by": delayed
        })

    return report_data


def get_chart(data):

    if not data:
        return None

    bucket_counts = {
        "0-5 Days": 0,
        "5-10 Days": 0,
        "10-15 Days": 0,
        "15+ Days": 0
    }

    for row in data:

        bucket = row.get("delay_bucket")

        if bucket in bucket_counts:
            bucket_counts[bucket] += 1

    return {
        "data": {
            "labels": list(bucket_counts.keys()),
            "datasets": [{
                "name": _("Delayed Tasks"),
                "values": list(bucket_counts.values())
            }]
        },
        "type": "bar",
        "colors": ["#3B82F6"]
    }
# # Copyright (c) 2026, Assimilator and contributors

# import frappe
# from frappe import _


# def execute(filters=None):
#     columns = get_columns()
#     data = get_data(filters)

#     chart = get_chart(data)

#     return columns, data, None, chart


# def get_columns():
#     return [

#         {
#             "label": _("Task ID"),
#             "fieldname": "name",
#             "fieldtype": "Link",
#             "options": "Tasks",
#             "width": 150
#         },

#         {
#             "label": _("Task Name"),
#             "fieldname": "task_name",
#             "fieldtype": "Data",
#             "width": 250
#         },

#         {
#             "label": _("Delay Bucket"),
#             "fieldname": "delay_bucket",
#             "fieldtype": "Data",
#             "width": 150
#         },

#         {
#             "label": _("Days Delayed"),
#             "fieldname": "delayed_by",
#             "fieldtype": "Int",
#             "width": 120
#         }

#     ]


# def get_data(filters=None):

#     delay_range = filters.get("delay_range") if filters else "All"

#     buckets = {
#         "0-5 Days": {"min": 1, "max": 5},
#         "5-10 Days": {"min": 6, "max": 10},
#         "10-15 Days": {"min": 11, "max": 15},
#         "15+ Days": {"min": 16, "max": 9999}
#     }

#     tasks = frappe.get_all(
#         "Tasks",
#         fields=[
#             "name",
#             "task_name",
#             "delayed_by",
#             "status"
#         ],
#         filters={
#             "delayed_by": [">", 0],
#             "status": ["not in", ["Completed", "Closed"]]
#         }
#     )

#     report_data = []

#     if delay_range != "All":

#         selected = buckets.get(delay_range)

#         for task in tasks:

#             delayed = task.delayed_by or 0

#             if selected["min"] <= delayed <= selected["max"]:

#                 report_data.append({
#                     "name": task.name,
#                     "task_name": task.task_name,
#                     "delay_bucket": delay_range,
#                     "delayed_by": delayed
#                 })

#     else:

#         bucket_counts = {
#             "0-5 Days": 0,
#             "5-10 Days": 0,
#             "10-15 Days": 0,
#             "15+ Days": 0
#         }

#         for task in tasks:

#             delayed = task.delayed_by or 0

#             if 1 <= delayed <= 5:
#                 bucket_counts["0-5 Days"] += 1

#             elif 6 <= delayed <= 10:
#                 bucket_counts["5-10 Days"] += 1

#             elif 11 <= delayed <= 15:
#                 bucket_counts["10-15 Days"] += 1

#             else:
#                 bucket_counts["15+ Days"] += 1

#         for bucket, count in bucket_counts.items():

#             report_data.append({
#                 "delay_bucket": bucket,
#                 "count": count
#             })

#     return report_data


# def get_chart(data):

#     if not data:
#         return None

#     labels = []
#     values = []

#     for row in data:

#         if row.get("count") is not None:

#             labels.append(row.get("delay_bucket"))
#             values.append(row.get("count"))

#     return {
#         "data": {
#             "labels": labels,
#             "datasets": [{
#                 "name": _("Delayed Tasks"),
#                 "values": values
#             }]
#         },
#         "type": "bar",
#         "colors": [
#             "#3B82F6",
#             "#F59E0B",
#             "#EF4444",
#             "#991B1B"
#         ]
#     }
# # Copyright (c) 2026, Assimilator and contributors
# # For license information, please see license.txt

# import frappe
# from frappe import _

# def execute(filters=None):
#     columns = get_columns()
#     data = get_data(filters)
    
#     chart = get_chart(data)
    
#     return columns, data, None, chart

# def get_columns():
#     return [
#         {"label": _("Delay Bucket"), "fieldname": "delay_bucket", "fieldtype": "Data", "width": 200},
#         {"label": _("Count"), "fieldname": "count", "fieldtype": "Int", "width": 100},
#         {"label": _("Task"), "fieldname": "task_name", "fieldtype": "Link", "options": "Tasks", "width": 150},
#         {"label": _("Days Delayed"), "fieldname": "delayed_by", "fieldtype": "Int", "width": 100}
#     ]

# def get_data(filters=None):
#     delay_range = filters.get("delay_range") if filters else None
    
#     # Define buckets
#     buckets = {
#         "0-5 Days": {"min": 1, "max": 5, "count": 0},
#         "5-10 Days": {"min": 6, "max": 10, "count": 0},
#         "10-15 Days": {"min": 11, "max": 15, "count": 0},
#         "15+ Days": {"min": 16, "max": 9999, "count": 0}
#     }
    
#     tasks = frappe.get_all("Tasks", 
#         fields=["name", "task_name","delayed_by", "status"], 
#         filters={"delayed_by": [">", 0], "status": ["not in", ["Completed", "Closed"]]}
#     )
    
#     report_data = []
    
#     if delay_range and delay_range != "All":
#         # Filtered data (List of tasks in that range)
#         selected = buckets.get(delay_range)
#         for task in tasks:
#             d = task.delayed_by or 0
#             if selected["min"] <= d <= selected["max"]:
#                 report_data.append({
#                     "delay_bucket": delay_range,
#                     "task_name": task.name,
#                     "delayed_by": d,
#                     "count": 1
#                 })
#     else:
#         # Summary data (Bucket counts)
#         for task in tasks:
#             d = task.delayed_by or 0
#             for b_name, b_info in buckets.items():
#                 if b_info["min"] <= d <= b_info["max"]:
#                     b_info["count"] += 1
        
#         for b_name, b_info in buckets.items():
#             report_data.append({
#                 "delay_bucket": b_name,
#                 "count": b_info["count"]
#             })
            
#     return report_data

# def get_chart(data):
#     if not data:
#         return None
        
#     labels = [d.get("delay_bucket") for d in data]
#     values = [d.get("count") for d in data]
    
#     return {
#         "data": {
#             "labels": labels,
#             "datasets": [
#                 {
#                     "name": _("Delayed Tasks"),
#                     "values": values
#                 }
#             ]
#         },
#         "type": "bar",
#         "colors": ["#ff5858", "#ffa00a", "#f39c12", "#c0392b"]
#     }
