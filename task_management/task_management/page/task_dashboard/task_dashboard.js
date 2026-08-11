frappe.pages['task_dashboard'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Enterprise Task Dashboard',
		single_column: true
	});

	page.set_primary_action('Refresh', () => {
		let current_range = $('#delay-filters button.active').attr('data-range') || 'All';
		render_dashboard(wrapper, current_range);
	});

	// Main Dashboard HTML Structure
	$(wrapper).find('.layout-main-section').empty().append(`
		<div class="dashboard-container">
			<!-- Sticky Filter Bar -->
			<div class="sticky-filter-bar">
				<span class="filter-label"><i class="fa fa-filter"></i> Delay Filter:</span>
				<div class="btn-group" id="delay-filters">
					<button class="btn btn-sm btn-outline-secondary active" data-range="All">All</button>
					<button class="btn btn-sm btn-outline-info" data-range="0-5 Days">0-5 Days</button>
					<button class="btn btn-sm btn-outline-warning" data-range="5-10 Days">5-10 Days</button>
					<button class="btn btn-sm btn-outline-danger" data-range="10-15 Days">10-15 Days</button>
					<button class="btn btn-sm btn-dark" data-range="15+ Days">15+ Days</button>
				</div>
			</div>

			<!-- Dashboard Grid -->
			<div class="dashboard-grid">
				
				<!-- LEFT COLUMN -->
				<div class="dashboard-col">
					<!-- Dashboard 1: Delayed Summary -->
					<div class="dashboard-card">
						<div class="card-header">
							<h4><i class="fa fa-pie-chart"></i> Delayed Tasks Summary</h4>
						</div>
						<div class="card-body chart-body" id="delay-chart">
							<p class="text-muted">Loading chart...</p>
						</div>
					</div>

					<!-- Filtered Delayed Tasks List -->
					<div class="dashboard-card">
						<div class="card-header">
							<h4><i class="fa fa-list"></i> Filtered Delayed Tasks</h4>
						</div>
						<div class="card-body" style="max-height: 500px; overflow-y: auto; padding: 0;">
							<div id="delay-list" class="list-group list-group-flush">
								<p class="p-4 text-muted">Select a range to see details.</p>
							</div>
						</div>
					</div>
				</div>

				<!-- RIGHT COLUMN -->
				<div class="dashboard-col">
					<!-- Dashboard 2: Upcoming Deadlines Chart -->
					<div class="dashboard-card">
						<div class="card-header">
							<h4><i class="fa fa-line-chart"></i> Upcoming Deadlines</h4>
						</div>
						<div class="card-body chart-body" id="deadline-chart">
							<p class="text-muted">Loading chart...</p>
						</div>
					</div>

					<!-- Upcoming Deadline Details List -->
					<div class="dashboard-card">
						<div class="card-header">
							<h4><i class="fa fa-calendar-check-o"></i> Upcoming Deadlines Details</h4>
						</div>
						<div class="card-body" style="max-height: 500px; overflow-y: auto; padding: 0;">
							<div id="upcoming-list" class="list-group list-group-flush">
								<p class="p-4 text-muted">Loading upcoming tasks...</p>
							</div>
						</div>
					</div>
				</div>

			</div>
		</div>
	`);

	// Initial Render
	render_dashboard(wrapper, 'All');

	// Filter Click Handler
	$(wrapper).on('click', '#delay-filters button', function() {
		let range = $(this).attr('data-range');
		$('#delay-filters button').removeClass('active');
		$(this).addClass('active');
		render_dashboard(wrapper, range);
	});
};

function render_dashboard(wrapper, range) {
	render_delay_chart(wrapper, range);
	render_deadline_chart(wrapper);
	render_delay_list(wrapper, range);
	render_upcoming_list(wrapper);
}

function render_delay_chart(wrapper, range) {
	frappe.call({
		method: 'frappe.desk.query_report.run',
		args: {
			report_name: 'Delayed Tasks Summary',
			filters: { delay_range: range }
		},
		callback: function(r) {
			if (r.message && r.message.result) {
				let labels = r.message.result.map(d => d.delay_bucket);
				let values = r.message.result.map(d => d.count);

				$("#delay-chart").empty();
				new frappe.Chart("#delay-chart", {
					data: {
						labels: labels,
						datasets: [{ name: "Delayed Count", values: values }]
					},
					type: range === 'All' ? 'bar' : 'percentage',
					height: 250,
					colors: get_chart_colors(range)
				});
			}
		}
	});
}

function get_chart_colors(range) {
	const colors = {
		'0-5 Days': ['#3182ce'], // Blue
		'5-10 Days': ['#dd6b20'], // Orange
		'10-15 Days': ['#e53e3e'], // Red
		'15+ Days': ['#742a2a'], // Dark Red
		'All': ['#3182ce', '#dd6b20', '#e53e3e', '#742a2a']
	};
	return colors[range] || colors['All'];
}

function render_deadline_chart(wrapper) {
	frappe.call({
		method: 'frappe.desk.query_report.run',
		args: { report_name: 'Upcoming Resolutions', filters: {} },
		callback: function(r) {
			if (r.message && r.message.result) {
				let tasks = r.message.result;
				let labels = tasks.map(d => d.name);
				let values = tasks.map(d => d.days_remaining);

				$("#deadline-chart").empty();
				if (tasks.length > 0) {
					new frappe.Chart("#deadline-chart", {
						data: { labels: labels, datasets: [{ name: "Days Left", values: values }] },
						type: 'bar', height: 250, colors: ['#38a169'] // Greenish
					});
				} else {
					$("#deadline-chart").html('<p class="text-muted">No upcoming deadlines.</p>');
				}
			}
		}
	});
}

function render_delay_list(wrapper, range) {
	frappe.call({
		method: 'frappe.desk.query_report.run',
		args: {
			report_name: 'Delayed Tasks Summary',
			filters: { delay_range: range }
		},
		callback: function(r) {
			let $list = $(wrapper).find('#delay-list');
			$list.empty();
			
			if (range === 'All') {
				$list.append('<p class="p-4 text-muted text-center">Select a specific delay range above to view tasks.</p>');
				return;
			}

			if (r.message && r.message.result && r.message.result.length > 0) {
				r.message.result.forEach(doc => {
					if (!doc.task_name) return;
					$list.append(`
						<a href="/app/tasks/${doc.task_name}" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
							<div style="flex: 1;">
								<div class="font-weight-bold" style="color: #2d3748;">${doc.task_name}</div>
								<div class="small text-muted">Bucket: ${range}</div>
							</div>
							<div class="text-right">
								<span class="badge badge-overdue badge-pill">
									<i class="fa fa-warning"></i> ${doc.delayed_by} Days Overdue
								</span>
							</div>
						</a>
					`);
				});
			} else {
				$list.append('<p class="p-4 text-muted text-center">No tasks in this range.</p>');
			}
		}
	});
}

function render_upcoming_list(wrapper) {
	frappe.call({
		method: 'frappe.desk.query_report.run',
		args: { report_name: 'Upcoming Resolutions', filters: {} },
		callback: function(r) {
			let $list = $(wrapper).find('#upcoming-list');
			$list.empty();
			if (r.message && r.message.result && r.message.result.length > 0) {
				r.message.result.forEach(doc => {
					let urgency = doc.days_remaining <= 2 ? 'badge-critical' : 'badge-upcoming';
					$list.append(`
						<a href="/app/tasks/${doc.name}" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
							<div style="flex: 1;">
								<div class="font-weight-bold" style="color: #2d3748;">${doc.name}</div>
								<div class="small text-info">${doc.status}</div>
							</div>
							<div class="text-right">
								<span class="badge ${urgency} badge-pill">
									${doc.days_remaining} Days Remaining
								</span>
								<div class="small text-muted mt-1">${doc.expected_resolution_date}</div>
							</div>
						</a>
					`);
				});
			} else {
				$list.append('<p class="p-4 text-muted text-center">No upcoming deadlines.</p>');
			}
		}
	});
}
