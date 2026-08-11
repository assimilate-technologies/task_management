frappe.pages['enterprise_dashboard'].on_page_load = function (wrapper) {

	// const roles = frappe.user_roles;

	// // Viewer cannot access dashboard
	// if (roles.includes("Task Viewer")) {

	// 	frappe.msgprint(
	// 		"You don't have permission to access dashboard"
	// 	);

	// 	frappe.set_route("List", "Tasks");
	// 	return;
	// }
	let page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Enterprise Dashboard',
		single_column: true
	});

	page.main.html(`
		<div class="enterprise-layout">

    <!-- Sidebar -->
    <div class="custom-sidebar">

        <div class="sidebar-logo">
            <h3>📋 Task Management</h3>
        </div>

        <div class="sidebar-menu">

            <div class="menu-item active" id="dashboard-link">
                📊 Dashboard
            </div>

            <div class="menu-item" id="my-task-link">
                ✅ My Tasks
            </div>

            <div class="menu-item" id="all-task-link">
                📋 All Tasks
            </div>

            <div class="menu-item" id="project-link">
                📁 Projects
            </div>

            <div class="menu-item" id="settings-link">
                ⚙️ Settings
            </div>

        </div>

    </div>

    <!-- Main Dashboard -->
    <div class="enterprise-dashboard">

        <!-- Top Header -->
        <div class="top-header">

            <div>
                <h2>Good Morning 👋</h2>
                <p>Here's what's happening with your tasks today.</p>
            </div>

            <div class="top-actions">

                <button class="btn btn-default" id="refresh-dashboard">
                    🔄 Refresh
                </button>

                <button class="btn btn-primary" id="new-task-btn">
                    + New Task
                </button>

            </div>

        </div>


		<div class="kpi-grid">

			<div class="kpi-card purple">
				<div>
					<h5>📋 Total Tasks</h5>
					<h2 id="total-tasks">0</h2>
				</div>
			</div>

			<div class="kpi-card orange">
				<div>
					<h5>⏰ Overdue Tasks</h5>
					<h2 id="overdue-tasks">0</h2>
				</div>
			</div>

			<div class="kpi-card red">
				<div>
					<h5>🚨 Critical Tasks</h5>
					<h2 id="critical-tasks">0</h2>
				</div>
			</div>

			<div class="kpi-card green">
				<div>
					<h5>✅Completed Tasks</h5>
					<h2 id="completed-tasks">0</h2>
				</div>
			</div>

		</div>
		<div class="dashboard-row">

			<div class="dashboard-panel">

				<div class="panel-header">

					<h4>⚠️ Tasks By Delay Range</h4>

					<select id="delay-filter" class="form-control">
						<option value="All">All Ranges</option>
						<option value="0-5 Days">0 - 5 Days</option>
						<option value="5-10 Days">5 - 10 Days</option>
						<option value="10-15 Days">10 - 15 Days</option>
						<option value="15+ Days">15+ Days</option>
					</select>

				</div>

				<div id="delay-chart"></div>

			</div>

			<div class="dashboard-panel">

				<div class="panel-header">

					<h4>🎯Upcoming Deadlines</h4>

					<select id="deadline-filter" class="form-control">
						<option value="7">Next 7 Days</option>
						<option value="15">Next 15 Days</option>
						<option value="30">Next 30 Days</option>
					</select>

				</div>

				<div id="deadline-chart"></div>

			</div>

		</div>
		<div class="dashboard-row bottom-row">

			<div class="dashboard-panel">
				<h4>🚨 Delayed Tasks</h4>
				<div id="delay-list"></div>
			</div>

			<div class="dashboard-panel">
				<h4>📅 Upcoming Deadlines</h4>
				<div id="upcoming-list"></div>
			</div>

			<div class="dashboard-panel">
				<h4>🎯 Tasks by Priority</h4>
				<div id="priority-chart"></div>
			</div>

		</div>

	</div>

	`);

	load_dashboard_data();
	load_delay_chart();
	load_deadline_chart();
	load_delay_list();
	load_upcoming_list();
	load_priority_chart();
};

// Today's Date
$("#today-date").text(
	frappe.datetime.str_to_user(
		frappe.datetime.get_today()
	)
);

// Refresh Dashboard
$(document).on("click", "#refresh-dashboard", function () {

	load_dashboard_data();
	load_delay_chart();
	load_deadline_chart();
	load_delay_list();
	load_upcoming_list();
	load_priority_chart();

	frappe.show_alert({
		message: "Dashboard Refreshed",
		indicator: "green"
	});
});

// New Task Button
$(document).on("click", "#new-task-btn", function () {
	frappe.new_doc("Tasks");
});


// Sidebar Navigation

$(document).on("click", "#my-task-link", function () {
	frappe.set_route("List", "Tasks");
});

$(document).on("click", "#all-task-link", function () {
	frappe.set_route("List", "Tasks");
});

$(document).on("click", "#project-link", function () {
	frappe.set_route("List", "Project");
});

$(document).on("click", "#calendar-link", function () {
	frappe.set_route("List", "Tasks", "Calendar");
});

$(document).on("click", "#report-link", function () {
	frappe.set_route("query-report", "Delayed Tasks Summary");
});

$(document).on("click", "#settings-link", function () {
	frappe.set_route("Form", "System Settings");
});

function load_dashboard_data() {

	frappe.call({
		method: "task_management.task_management.page.enterprise_dashboard.enterprise_dashboard.get_dashboard_data",
		callback: function (r) {

			if (!r.message) return;

			$("#total-tasks").text(r.message.total_tasks || 0);
			$("#overdue-tasks").text(r.message.overdue_tasks || 0);
			$("#critical-tasks").text(r.message.critical_tasks || 0);
			$("#completed-tasks").text(r.message.completed_tasks || 0);
		}
	});
}


function load_delay_chart(delay_range = "All") {

	frappe.call({
		method: "frappe.desk.query_report.run",
		args: {
			report_name: "Delayed Tasks Summary",
			filters: {
				delay_range: delay_range
			}
		},
		callback: function (r) {

			if (!r.message || !r.message.result) return;

			let bucketCounts = {
				"🟢 0-5 Days": 0,
				"🟡 5-10 Days": 0,
				"🟠 10-15 Days": 0,
				"🔴 15+ Days": 0
			};

			r.message.result.forEach(row => {

				let bucket = "";

				if (row.delay_bucket === "0-5 Days")
					bucket = "🟢 0-5 Days";

				else if (row.delay_bucket === "5-10 Days")
					bucket = "🟡 5-10 Days";

				else if (row.delay_bucket === "10-15 Days")
					bucket = "🟠 10-15 Days";

				else
					bucket = "🔴 15+ Days";

				bucketCounts[bucket]++;

			});

			$("#delay-chart").empty();

			new frappe.Chart("#delay-chart", {

				data: {
					labels: Object.keys(bucketCounts),

					datasets: [{
						name: "Delayed Tasks",
						values: Object.values(bucketCounts)
					}]
				},

				type: "bar",
				height: 320,

				barOptions: {
					spaceRatio: 0.35
				},

				colors: [
					"#48bb78", // Green
					"#FACC15", // Yellow
					"#F97316", // Orange
					"#EF4444"  // Red
				]
			});
		}
	});
}


function load_deadline_chart(days = 7) {

	frappe.call({
		method: "frappe.desk.query_report.run",
		args: {
			report_name: "Upcoming Resolutions",
			filters: {
				days: days
			}
		},
		callback: function (r) {

			if (!r.message || !r.message.result) return;

			let labels = [];
			let values = [];

			r.message.result.forEach(row => {
				labels.push(row.name);
				values.push(row.days_remaining);
			});

			$("#deadline-chart").empty();
			new frappe.Chart("#deadline-chart", {

				data: {
					labels: labels,
					datasets: [{
						values: values
					}]
				},

				type: "bar",
				height: 280,

				colors: ["#48bb78"]
			});

			// new frappe.Chart("#deadline-chart", {
			// 	data: {
			// 		labels: labels,
			// 		datasets: [{
			// 			name: "Days Remaining",
			// 			values: values
			// 		}]
			// 	},
			// 	type: "line",
			// 	height: 280,
			// 	colors: ['#48bb78']
			// });
		}
	});
}


function load_delay_list(delay_range = "All") {

	frappe.call({

		method: "frappe.desk.query_report.run",

		args: {
			report_name: "Delayed Tasks Summary",
			filters: {
				delay_range: delay_range
			}
		},

		callback: function (r) {

			let html = "";

			if (r.message && r.message.result) {

				r.message.result.forEach(row => {

					html += `
						<div class="task-item task-link"
							data-task="${row.name}">

							<div>

								<strong>${row.task_name}</strong>

								<br>

								<small style="color:#718096;">
									${row.name}
								</small>

							</div>

							<div class="text-danger">
								${row.delayed_by} Days
							</div>

						</div>
					`;
				});
			}

			$("#delay-list").html(
				html || "<p>No delayed tasks found.</p>"
			);
		}
	});
}

function load_upcoming_list(days = 7) {

	frappe.call({
		method: "frappe.desk.query_report.run",
		args: {
			report_name: "Upcoming Resolutions",
			filters: {
				days: days
			}
		},
		callback: function (r) {

			let html = "";

			if (r.message && r.message.result) {

				r.message.result.forEach(row => {

					html += `
						<div class="task-item upcoming-task-link"
							data-task="${row.name}">

							<div>
								<strong>${row.task_name}</strong>

								<br>

								<small style="color:#718096;">
									${row.name}
								</small>
							</div>

							<div class="text-success">
								${row.days_remaining} Days Left
							</div>

						</div>
					`;
				});
			}

			$("#upcoming-list").html(html || "<p>No upcoming tasks found.</p>");
		}
	});
}
function load_priority_chart() {

	frappe.call({

		method: "task_management.task_management.page.enterprise_dashboard.enterprise_dashboard.get_priority_data",

		callback: function (r) {

			if (!r.message) return;

			let priority_map = {
				"Urgent": 0,
				"Planned": 0,
				"Done": 0
			};

			r.message.forEach(row => {

				let label = row.priority;

				if (label === "Important-Urgent")
					label = "Urgent";

				else if (label === "Important-Not Urgent")
					label = "Planned";

				else if (label === "Completed")
					label = "Done";

				priority_map[label] = row.count;

			});

			let labels = [
				"Urgent",
				"Planned",
				"Done"
			];

			let values = [
				priority_map["Urgent"] || 0,
				priority_map["Planned"] || 0,
				priority_map["Done"] || 0
			];

			$("#priority-chart").empty();

			new frappe.Chart("#priority-chart", {

				data: {
					labels: labels,
					datasets: [{
						values: values
					}]
				},

				type: "donut",
				height: 320,

				colors: [
					"#EF4444", // Urgent = Red
					"#F59E0B", // Planned = Orange
					"#10B981"  // Done = Green
				]
			});
		}
	});
}
// function load_priority_chart() {

// 	frappe.call({

// 		method: "task_management.task_management.page.enterprise_dashboard.enterprise_dashboard.get_priority_data",

// 		callback: function (r) {

// 			if (!r.message) return;

// 			let labels = [];
// 			let values = [];

// 			r.message.forEach(row => {
// 				let label = row.priority;
// 				if (label === "Important-Urgent")
// 					label = "Urgent";

// 				if (label === "Important-Not Urgent")
// 					label = "Planned";

// 				if (label === "Completed")
// 					label = "Done";

// 				labels.push(label);
// 				values.push(row.count);

// 				// labels.push(row.priority);
// 				// values.push(row.count);

// 			});

// 			$("#priority-chart").empty();

// 			new frappe.Chart("#priority-chart", {

// 				data: {
// 					labels: labels,
// 					datasets: [{
// 						values: values
// 					}]
// 				},

// 				type: "bar",
// 				height: 300,

// 				colors: [
// 					"#DC2626",
// 					"#F59E0B",
// 					"#10B981",
// 					"#3B82F6"
// 				]
// 			});
// 		}
// 	});
// }
$(document).on("click", ".task-link", function () {

	let task_name = $(this).data("task");

	frappe.set_route(
		"Form",
		"Tasks",
		task_name
	);

});

$(document).on("click", ".upcoming-task-link", function () {

	let task_name = $(this).data("task");

	frappe.set_route(
		"Form",
		"Tasks",
		task_name
	);

});
$(document).on("change", "#delay-filter", function () {

	let selected_range = $(this).val();

	load_delay_chart(selected_range);
	load_delay_list(selected_range);

});
$(document).on("change", "#deadline-filter", function () {

	let days = $(this).val();

	load_deadline_chart(days);
	load_upcoming_list(days);

});


// frappe.pages['enterprise_dashboard'].on_page_load = function (wrapper) {

// 	let page = frappe.ui.make_app_page({
// 		parent: wrapper,
// 		title: 'Enterprise Dashboard',
// 		single_column: true
// 	});

// 	page.main.html(`

// 	<div class="enterprise-dashboard">

// 		<div class="hero-section">
// 			<div>
// 				<h1>Good Morning 👋</h1>
// 				<p>Monitor projects, tasks and team performance.</p>
// 			</div>
// 		</div>

// 		<div class="kpi-grid">

// 			<div class="kpi-card purple">
// 				<div>
// 					<h5>Total Tasks</h5>
// 					<h2 id="total-tasks">0</h2>
// 				</div>
// 			</div>

// 			<div class="kpi-card orange">
// 				<div>
// 					<h5>Overdue Tasks</h5>
// 					<h2 id="overdue-tasks">0</h2>
// 				</div>
// 			</div>

// 			<div class="kpi-card red">
// 				<div>
// 					<h5>Critical Tasks</h5>
// 					<h2 id="critical-tasks">0</h2>
// 				</div>
// 			</div>

// 			<div class="kpi-card green">
// 				<div>
// 					<h5>Completed Tasks</h5>
// 					<h2 id="completed-tasks">0</h2>
// 				</div>
// 			</div>

// 		</div>

// 	</div>

// 	`);

// 	load_dashboard_data();
// };


// function load_dashboard_data() {

// 	frappe.call({
// 		method: "task_management.task_management.page.enterprise_dashboard.enterprise_dashboard.get_dashboard_data",

// 		callback: function (r) {

// 			if (!r.message) return;

// 			$("#total-tasks").text(r.message.total_tasks || 0);

// 			$("#overdue-tasks").text(r.message.overdue_tasks || 0);

// 			$("#critical-tasks").text(r.message.critical_tasks || 0);

// 			$("#completed-tasks").text(r.message.completed_tasks || 0);
// 		}
// 	});
// }