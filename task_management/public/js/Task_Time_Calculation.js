frappe.ui.form.on('Assign Users Task', {

    // ====================================
    // Hours Spent Change
    // ====================================
    hours_spent: function (frm, cdt, cdn) {
        calculate_total_hours(frm);
    }

});


// ====================================
// Calculate Total Hours
// ====================================

function calculate_total_hours(frm) {

    let total = 0;

    // Loop through Time Logs
    (frm.doc.time_logs || []).forEach(row => {
        total += flt(row.hours_spent);
    });

    // Set Total Hours
    frm.set_value('total_hours', total.toFixed(2));
}