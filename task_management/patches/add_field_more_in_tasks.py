# import frappe
# from frappe.custom.doctype.custom_field.custom_field import create_custom_fields

# def execute():

#     custom_fields = {

#         "Tasks": [
            
#             # Digital Signature
#             dict(
#                 fieldname="more_to_do",
#                 label="More To Do",
#                 fieldtype="Data",
#                 insert_after="deliver_date",
#                 reqd=0
#             )
#         ],
                
#     }

#     # Create or update custom fields
#     create_custom_fields(custom_fields, update=True)
#     frappe.db.commit()
