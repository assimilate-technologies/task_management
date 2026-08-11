

// // ==========================================
// // CONSTANTS & UTILS
// // ==========================================
// const COMPLETED_STATUSES = ["Completed", "Closed", "Moved to Production", "Design Completed", "Testing completed"];

// // ==========================================
// // LIST VIEW SETTINGS
// // ==========================================
// frappe.listview_settings['Tasks'] = {
//     add_fields: ["action", "delayed_by", "priority", "status", "expected_resolution_date"],

//     formatters: {
//         // Delayed By Column
//         delayed_by(value, field, doc) {
//             let delay = 0;
//             if (doc.expected_resolution_date && !COMPLETED_STATUSES.includes(doc.status)) {
//                 let today = frappe.datetime.get_today();
//                 let diff = frappe.datetime.get_diff(doc.expected_resolution_date, today);
//                 if (diff < 0) delay = Math.abs(diff);
//             } else {
//                 delay = 0;
//             }

//             if (delay === 0) return `<span class="text-muted">0</span>`;
//             let color = delay > 7 ? "red" : "orange";
//             let icon = delay > 7 ? "fa fa-fire" : "fa fa-clock-o";
//             return `<span class="indicator-pill ${color}"><i class="${icon}"></i> ${delay} Days</span>`;
//         },

//         // Status Column
//         status(value, field, doc) {
//             let delay = 0;
//             if (doc.expected_resolution_date && !COMPLETED_STATUSES.includes(doc.status)) {
//                 let today = frappe.datetime.get_today();
//                 let diff = frappe.datetime.get_diff(doc.expected_resolution_date, today);
//                 if (diff < 0) delay = Math.abs(diff);
//             }

//             let color = "blue";
//             let text = value || "On Time";
//             let icon = "fa fa-tasks";

//             if (COMPLETED_STATUSES.includes(doc.status)) {
//                 color = "green"; icon = "fa fa-check";
//             } else if (delay > 0) {
//                 color = "red"; icon = "fa fa-warning"; text = "Overdue";
//             }

//             return `<span class="indicator-pill ${color}"><i class="${icon}"></i> ${text}</span>`;
//         },

//         // Action Column
//         action(value) {
//             if (!value) return "";
//             const colors = { "Bravo!!": "green", "Schedule it": "blue", "Do it First": "red", "Hold/Delete": "orange" };
//             return `<span class="indicator-pill ${colors[value] || 'gray'}">${value}</span>`;
//         },

//         // Priority Column
//         priority(value) {
//             if (!value) return "";
//             const colors = { "Completed": "green", "Important-Urgent": "red", "Important-Not Urgent": "orange", "Not Important-Not Urgent": "gray" };
//             return `<span class="indicator-pill ${colors[value] || 'gray'}">${value}</span>`;
//         }
//     },

//     get_indicator: function (doc) {
//         if (COMPLETED_STATUSES.includes(doc.status)) return [__("Completed"), "green"];
//         let delay = Number(doc.delayed_by || 0);
//         if (delay > 0) return [__(`Overdue (${delay})`), "red"];
//         return [__("On Time"), "blue"];
//     },

//     refresh: function (listview) {
//         apply_advanced_styles(listview);
//     },

//     onload: function (listview) {
//         apply_advanced_styles(listview);
//     }
// };

// function apply_advanced_styles(listview) {
//     if (!document.getElementById("advanced-task-style")) {
//         let style = document.createElement("style");
//         style.id = "advanced-task-style";
//         style.innerHTML = `
//             .indicator-pill {
//                 display: inline-flex !important;
//                 align-items: center !important;
//                 gap: 5px !important;
//                 padding: 4px 12px !important;
//                 border-radius: 20px !important;
//                 font-size: 11px !important;
//                 font-weight: 700 !important;
//                 white-space: nowrap !important;
//             }
//             .indicator-pill.green { background-color: #DEF7EC !important; color: #03543F !important; }
//             .indicator-pill.blue { background-color: #E1EFFE !important; color: #1E429F !important; }
//             .indicator-pill.red { background-color: #FDE8E8 !important; color: #9B1C1C !important; }
//             .indicator-pill.orange { background-color: #FEF3C7 !important; color: #92400E !important; }
//             .indicator-pill.gray { background-color: #F3F4F6 !important; color: #374151 !important; }

//             .list-row-overdue { background-color: #FFF5F5 !important; border-left: 6px solid #F05252 !important; }
//             .list-row-completed { background-color: #F3FAF7 !important; border-left: 6px solid #31C48D !important; }
//         `;
//         document.head.appendChild(style);
//     }

//     setTimeout(() => {
//         listview.data.forEach(doc => {
//             let $row = $(`.list-row[data-name="${doc.name}"]`);
//             $row.removeClass('list-row-overdue list-row-completed');

//             let delay = 0;
//             if (doc.expected_resolution_date && !COMPLETED_STATUSES.includes(doc.status)) {
//                 let diff = frappe.datetime.get_diff(doc.expected_resolution_date, frappe.datetime.get_today());
//                 if (diff < 0) delay = Math.abs(diff);
//             }

//             if (COMPLETED_STATUSES.includes(doc.status)) $row.addClass("list-row-completed");
//             else if (delay > 0) $row.addClass("list-row-overdue");
//         });
//     }, 600);
// }

