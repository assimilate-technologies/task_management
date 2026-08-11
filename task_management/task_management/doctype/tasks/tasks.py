from frappe.model.document import Document
from frappe.utils import date_diff, today


class Tasks(Document):

    def validate(self):

        self.calculate_days()
        self.calculate_delay()

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