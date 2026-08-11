// frappe.listview_settings['Tasks'] = {

//     onload: function(listview) {

//         // Prevent duplicate
//         if ($('#custom-task-dashboard').length) {
//             return;
//         }

//         // ====================================
//         // DASHBOARD HTML
//         // ====================================

//         let dashboard = $(`

//             <div id="custom-task-dashboard">

//                 <!-- KPI CARDS -->
//                 <div class="dashboard-grid">

//                     <div class="dashboard-card blue">
//                         <h4>Total Tasks</h4>
//                         <h1 id="total-tasks">0</h1>
//                     </div>

//                     <div class="dashboard-card orange">
//                         <h4>Overdue Tasks</h4>
//                         <h1 id="overdue-tasks">0</h1>
//                     </div>

//                     <div class="dashboard-card red">
//                         <h4>Critical Tasks</h4>
//                         <h1 id="critical-tasks">0</h1>
//                     </div>

//                     <div class="dashboard-card green">
//                         <h4>Completed Tasks</h4>
//                         <h1 id="completed-tasks">0</h1>
//                     </div>

//                 </div>

//                 <!-- CUSTOM DASHBOARD -->
//                 <div class="iframe-wrapper">

//                     <iframe
//                         id="dashboard-frame"
//                         src="/app/task_dashboard"
//                         width="100%"
//                         height="750px">
//                     </iframe>

//                 </div>

//             </div>

//         `);

//         // ====================================
//         // ADD ON TOP
//         // ====================================

//         $('.layout-main-section').prepend(dashboard);

//         // ====================================
//         // STYLES
//         // ====================================

//         if (!$('#task-dashboard-style').length) {

//             $('head').append(`

//                 <style id="task-dashboard-style">

//                     /* ====================================
//                        Main Dashboard
//                     ==================================== */

//                     #custom-task-dashboard {

//                         width: 100%;

//                         margin-bottom: 20px;
//                     }

//                     /* ====================================
//                        KPI Grid
//                     ==================================== */

//                     .dashboard-grid {

//                         display: grid;

//                         grid-template-columns: repeat(4, 1fr);

//                         gap: 15px;

//                         margin-bottom: 20px;
//                     }

//                     /* ====================================
//                        Cards
//                     ==================================== */

//                     .dashboard-card {

//                         padding: 20px;

//                         border-radius: 12px;

//                         color: white;

//                         text-align: center;

//                         box-shadow: 0 2px 8px rgba(0,0,0,0.1);

//                         transition: 0.3s;
//                     }

//                     .dashboard-card:hover {

//                         transform: translateY(-5px);
//                     }

//                     .dashboard-card h1 {

//                         margin-top: 10px;

//                         font-size: 32px;
//                     }

//                     /* ====================================
//                        Colors
//                     ==================================== */

//                     .blue {
//                         background: #3498db;
//                     }

//                     .orange {
//                         background: #f39c12;
//                     }

//                     .red {
//                         background: #e74c3c;
//                     }

//                     .green {
//                         background: #2ecc71;
//                     }

//                     /* ====================================
//                        Iframe Wrapper
//                     ==================================== */

//                     .iframe-wrapper {

//                         background: white;

//                         border-radius: 12px;

//                         overflow: hidden;

//                         border: 1px solid #d1d8dd;

//                         box-shadow: 0 2px 8px rgba(0,0,0,0.08);
//                     }

//                     /* ====================================
//                        Iframe
//                     ==================================== */

//                     #dashboard-frame {

//                         border: none;

//                         width: 100%;
//                     }

//                 </style>
//             `);
//         }

//         // ====================================
//         // LOAD KPI COUNTS
//         // ====================================

//         setTimeout(() => {

//             let data = listview.data || [];

//             let total =
//                 data.length;

//             let overdue =
//                 data.filter(
//                     d => d.delayed_by > 0
//                 ).length;

//             let critical =
//                 data.filter(
//                     d => d.delayed_by > 7
//                 ).length;

//             let completed =
//                 data.filter(
//                     d => d.priority === "Completed"
//                 ).length;

//             $('#total-tasks').text(total);

//             $('#overdue-tasks').text(overdue);

//             $('#critical-tasks').text(critical);

//             $('#completed-tasks').text(completed);

//         }, 1000);

//         // ====================================
//         // CLEAN IFRAME
//         // ====================================

//         $('#dashboard-frame').on('load', function() {

//             let iframe =
//                 document.getElementById('dashboard-frame');

//             let iframeDoc =
//                 iframe.contentWindow.document;

//             // Hide navbar
//             $(iframeDoc)
//                 .find('.navbar')
//                 .hide();

//             // Hide sidebar
//             $(iframeDoc)
//                 .find('.layout-side-section')
//                 .hide();

//             // Hide page header
//             $(iframeDoc)
//                 .find('.page-head')
//                 .hide();

//             // Hide footer
//             $(iframeDoc)
//                 .find('footer')
//                 .hide();

//             // Full width
//             $(iframeDoc)
//                 .find('.layout-main-section')
//                 .css({

//                     width: '100%',

//                     margin: '0',

//                     padding: '0'
//                 });

//             // Remove padding
//             $(iframeDoc)
//                 .find('.page-content')
//                 .css({

//                     padding: '0'
//                 });

//             // Full container
//             $(iframeDoc)
//                 .find('.container')
//                 .css({

//                     width: '100%',

//                     maxWidth: '100%'
//                 });
//         });
//     }
// };


// frappe.listview_settings['Tasks'] = {

//     onload: function(listview) {

//         // Prevent duplicate dashboard
//         if ($('#custom-task-dashboard').length) {
//             return;
//         }

//         // ====================================
//         // DASHBOARD HTML
//         // ====================================

//         let dashboard = $(`

//             <div id="custom-task-dashboard">

//                 <iframe
//                     id="dashboard-frame"
//                     src="/app/task_dashboard"
//                     width="100%"
//                     height="750px">
//                 </iframe>

//             </div>

//         `);

//         // ====================================
//         // ADD DASHBOARD ON TOP
//         // ====================================

//         $('.layout-main-section').prepend(dashboard);

//         // ====================================
//         // ADD CSS
//         // ====================================

//         if (!$('#task-dashboard-style').length) {

//             $('head').append(`

//                 <style id="task-dashboard-style">

//                     /* ====================================
//                        Dashboard Container
//                     ==================================== */

//                     #custom-task-dashboard {

//                         position: relative !important;

//                         width: 100%;

//                         background: white;

//                         border-radius: 12px;

//                         overflow: hidden;

//                         border: 1px solid #d1d8dd;

//                         margin-bottom: 20px;

//                         box-shadow: 0 2px 8px rgba(0,0,0,0.08);
//                     }

//                     /* ====================================
//                        Dashboard Iframe
//                     ==================================== */

//                     #dashboard-frame {

//                         border: none;

//                         width: 100%;

//                         background: white;
//                     }

//                     /* ====================================
//                        Prevent Movement
//                     ==================================== */

//                     .layout-main-section {

//                         overflow: visible !important;
//                     }

//                     #custom-task-dashboard iframe {

//                         display: block;
//                     }

//                 </style>

//             `);
//         }

//         // ====================================
//         // CLEAN IFRAME UI
//         // ====================================

//         $('#dashboard-frame').on('load', function() {

//             let iframe =
//                 document.getElementById('dashboard-frame');

//             let iframeDoc =
//                 iframe.contentWindow.document;

//             // Hide Navbar
//             $(iframeDoc)
//                 .find('.navbar')
//                 .hide();

//             // Hide Sidebar
//             $(iframeDoc)
//                 .find('.layout-side-section')
//                 .hide();

//             // Hide Page Header
//             $(iframeDoc)
//                 .find('.page-head')
//                 .hide();

//             // Hide Footer
//             $(iframeDoc)
//                 .find('footer')
//                 .hide();

//             // Make Full Width
//             $(iframeDoc)
//                 .find('.layout-main-section')
//                 .css({

//                     width: '100%',

//                     margin: '0',

//                     padding: '0'
//                 });

//             // Remove Extra Padding
//             $(iframeDoc)
//                 .find('.page-content')
//                 .css({

//                     padding: '0'
//                 });

//             // Full Width Container
//             $(iframeDoc)
//                 .find('.container')
//                 .css({

//                     width: '100%',

//                     maxWidth: '100%'
//                 });
//         });
//     }
// };
//--------------------------------------------------------------
// frappe.listview_settings['Tasks'] = {

//     onload: function(listview) {

//         // Prevent duplicate
//         if ($('#custom-task-dashboard').length) {
//             return;
//         }

//         // ====================================
//         // Dashboard Section
//         // ====================================

//         let dashboard = $(`
//             <div id="custom-task-dashboard"
//                 style="
//                     margin-bottom:20px;
//                     border-radius:12px;
//                     overflow:hidden;
//                     border:1px solid #d1d8dd;
//                     background:white;
//                 ">

//                 <iframe
//                     id="dashboard-frame"
//                     src="/app/task_dashboard"
//                     width="100%"
//                     height="750px"
//                     style="border:none;">
//                 </iframe>

//             </div>
//         `);

//         // Add above task list
//         listview.page.main.prepend(dashboard);

//         // ====================================
//         // Clean iframe UI
//         // ====================================

//         $('#dashboard-frame').on('load', function() {

//             let iframe =
//                 document.getElementById('dashboard-frame');

//             let iframeDoc =
//                 iframe.contentWindow.document;

//             // Hide navbar
//             $(iframeDoc)
//                 .find('.navbar')
//                 .hide();

//             // Hide sidebar
//             $(iframeDoc)
//                 .find('.layout-side-section')
//                 .hide();

//             // Hide page header
//             $(iframeDoc)
//                 .find('.page-head')
//                 .hide();

//             // Hide footer
//             $(iframeDoc)
//                 .find('footer')
//                 .hide();

//             // Full width
//             $(iframeDoc)
//                 .find('.layout-main-section')
//                 .css({
//                     width: '100%',
//                     margin: '0',
//                     padding: '0'
//                 });
//             // Remove extra spacing
//             $(iframeDoc)
//                 .find('.page-content')
//                 .css({
//                     padding: '0'
//                 });
//         });
//     }
// };
// frappe.listview_settings['Tasks'] = {

//     onload: function (listview) {

//         // Prevent duplicate dashboard
//         if ($('#custom-task-dashboard').length) {
//             return;
//         }

//         // ====================================
//         // Dashboard HTML
//         // ====================================

//         let dashboard = $(`
        
//             <div id="custom-task-dashboard">

//                 <div class="dashboard-grid">

//                     <div class="dashboard-card blue">
//                         <h4>Total Tasks</h4>
//                         <h1 id="total-tasks">0</h1>
//                     </div>

//                     <div class="dashboard-card orange">
//                         <h4>Overdue Tasks</h4>
//                         <h1 id="overdue-tasks">0</h1>
//                     </div>

//                     <div class="dashboard-card red">
//                         <h4>Critical Tasks</h4>
//                         <h1 id="critical-tasks">0</h1>
//                     </div>

//                     <div class="dashboard-card green">
//                         <h4>Completed Tasks</h4>
//                         <h1 id="completed-tasks">0</h1>
//                     </div>

//                 </div>

//             </div>
//         `);

//         // Add dashboard above list
//         listview.page.main.prepend(dashboard);

//         // ====================================
//         // Add Styles
//         // ====================================

//         if (!$('#task-dashboard-style').length) {

//             $('head').append(`

//                 <style id="task-dashboard-style">

//                     #custom-task-dashboard {

//                         margin-bottom: 20px;
//                     }

//                     .dashboard-grid {

//                         display: grid;

//                         grid-template-columns: repeat(4, 1fr);

//                         gap: 15px;
//                     }

//                     .dashboard-card {

//                         padding: 20px;

//                         border-radius: 12px;

//                         color: white;

//                         text-align: center;

//                         box-shadow: 0 2px 8px rgba(0,0,0,0.1);
//                     }

//                     .dashboard-card h1 {

//                         margin-top: 10px;

//                         font-size: 32px;
//                     }

//                     .blue {
//                         background: #3498db;
//                     }

//                     .orange {
//                         background: #f39c12;
//                     }

//                     .red {
//                         background: #e74c3c;
//                     }

//                     .green {
//                         background: #2ecc71;
//                     }

//                 </style>
//             `);
//         }

//         // ====================================
//         // Load Counts
//         // ====================================

//         setTimeout(() => {

//             let data = listview.data || [];

//             let total =
//                 data.length;

//             let overdue =
//                 data.filter(
//                     d => d.delayed_by > 0
//                 ).length;

//             let critical =
//                 data.filter(
//                     d => d.delayed_by > 7
//                 ).length;

//             let completed =
//                 data.filter(
//                     d => d.priority === "Completed"
//                 ).length;

//             $('#total-tasks').text(total);

//             $('#overdue-tasks').text(overdue);

//             $('#critical-tasks').text(critical);

//             $('#completed-tasks').text(completed);

//         }, 1000);
//     }
// };
// frappe.listview_settings['Tasks'] = {

//     onload: function (listview) {

//         // Prevent duplicate dashboard
//         if (listview.page.main.find('#custom-task-dashboard').length) {
//             return;
//         }

//         // Dashboard HTML
//         let dashboard = $(`
//             <div id="custom-task-dashboard"
//                 style="
//                     margin-bottom:20px;
//                     border-radius:12px;
//                     overflow:hidden;
//                     border:1px solid #d1d8dd;
//                     background:white;
//                 ">

//                 <iframe
//                     src="/app/task_dashboard"
//                     width="100%"
//                     height="700px"
//                     style="border:none;">
//                 </iframe>

//             </div>
//         `);

//         // Add ONLY inside list view
//         listview.page.main.prepend(dashboard);
//     }
// };