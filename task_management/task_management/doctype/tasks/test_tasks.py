# Copyright (c) 2026, Assimilator and Contributors
# See license.txt

import frappe
from frappe.tests.utils import FrappeTestCase


class TestTasks(FrappeTestCase):
	def test_total_hours_sum_of_hours_spent(self):
		task = frappe.get_doc(
			{
				"doctype": "Tasks",
				"task_name": "Test Total Hours",
				"time_logs": [
					{"employee": None, "hours_spent": 1.5, "start_time": None, "end_time": None},
					{"employee": None, "hours_spent": 2.5, "start_time": None, "end_time": None},
				],
			}
		)
		task.save()

		self.assertEqual(task.total_hours, 4.0)