frappe.ui.form.on('Tasks', {

    reporting_date: function (frm) {

        update_days(frm);
    },

    expected_resolution_date: function (frm) {

        update_delay(frm);
    },

    priority: function (frm) {

        update_action(frm);
        update_delay(frm);
    }

});


// ====================================
// Days UI Update
// ====================================

function update_days(frm) {

    if (!frm.doc.reporting_date) {
        return;
    }

    let days = frappe.datetime.get_diff(
        frappe.datetime.get_today(),
        frm.doc.reporting_date
    );

    frm.set_value('days', Math.max(0, days));
}


// ====================================
// Delay UI Update
// ====================================

function update_delay(frm) {

    if (frm.doc.priority === "Completed") {

        frm.set_value('delayed_by', 0);
        return;
    }

    if (!frm.doc.expected_resolution_date) {
        return;
    }

    let delay = frappe.datetime.get_diff(
        frappe.datetime.get_today(),
        frm.doc.expected_resolution_date
    );

    frm.set_value('delayed_by', Math.max(0, delay));
}


// ====================================
// Action UI Update
// ====================================

function update_action(frm) {

    if (frm.doc.priority === "Completed") {

        frm.set_value('action', 'Bravo!!');
    }

    else if (frm.doc.priority === "Important-Urgent") {

        frm.set_value('action', 'Do it First');
    }

    else if (frm.doc.priority === "Important-Not Urgent") {

        frm.set_value('action', 'Schedule it');
    }

    else if (frm.doc.priority === "Not Important-Not Urgent") {

        frm.set_value('action', 'Hold/Delete');
    }
}