from frappe import _

def get_data(data=None):
    return {
        "fieldname": "project_name",
        "transactions": [
            {
                "label": _("Tasks"),
                "items": ["Tasks"]
            }
        ]
    }