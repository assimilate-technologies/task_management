import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import date_diff, flt, today


class Tasks(Document):

    def validate(self):

        self.calculate_days()
        self.calculate_delay()
        self.calculate_total_hours()
        self.validate_hours_spent()

    # ====================================
    # Calculate Days
    # ====================================

    def calculate_days(self):

        if self.reporting_date:

            self.days = max(
                0,
                date_diff(today(), self.reporting_date)
            )

        else:

            self.days = 0

    # ====================================
    # Calculate Delayed By
    # ====================================

    def calculate_delay(self):

        # Completed Priority
        if self.priority == "Completed":

            self.delayed_by = 0
            return

        # No expected date
        if not self.expected_resolution_date:

            self.delayed_by = 0
            return

        delay = date_diff(
            today(),
            self.expected_resolution_date
        )

        # Only overdue
        self.delayed_by = max(0, delay)

    # ====================================
    # Calculate Total Hours
    # ====================================

    def calculate_total_hours(self):

        self.total_hours = sum(
            flt(log.hours_spent)
            for log in self.get("time_logs")
        )

    # ====================================
    # Validate Hours Spent
    # ====================================

    def validate_hours_spent(self):

        for log in self.get("time_logs"):

            if not log.hours_spent or log.hours_spent <= 0:

                frappe.throw(
                    _("Row {0}: Hours Spent is mandatory for each time log.").format(log.idx)
                )