app_name = "task_management"
app_title = "Task_management"
app_publisher = "Assimilator"
app_description = "This is Task MAnagement app"
app_email = "rutujasangar1770@gmail.com"
app_license = "mit"

# Custom fields add here patched
#after_migrate = []

app_include_css = [
                    "/assets/task_management/css/custom.css",
                    "/assets/task_management/css/enterprise_dashboard.css"
                ]

doctype_js = {
    "Tasks": "public/js/calculate_delayed_by_on_task.js"
}

override_doctype_dashboards = {
    "Project": "task_management.project_dashboard.get_data"
}
#Backend code write here api files
# doc_events = {
#     "Tasks": {
#         "on_update": "task_management.task_management.api.update_status.update_status",
#     }
# }
doc_events = {
    "Tasks": {
        "after_insert": "task_management.api.api.create_task_user_permission",
        "on_update": "task_management.api.api.create_task_user_permission"
    }
}