$("#medic-form").submit(function (e) {
    e.preventDefault();
});

const medicines = [{
    medicine: 1,
    frequency: ''
}];

function addMoreMedicine() {
    medicines.push({
        medicine: 1,
        frequency: ''
    });
    renderMedicine();
}

function removeMedicine(index) {
    if (medicines.length === 1) return alertWarning('É preciso ter ao menos um medicamento adicionado ao receituário médico.');
    medicines.splice(index, 1);
    renderMedicine();
}

function updateMedicine(index, value) {
    medicines[index].medicine = value;
}

function updateFrequency(index, value) {
    medicines[index].frequency = value;
}

function alertWarning(message) {
    Swal.fire({
        title: 'Atenção!',
        text: message,
        icon: 'warning',
        confirmButtonText: 'Ok',
        heightAuto: false
    })
}

function renderMedicine() {
    const medicineList = $('#medicineList');
    medicineList.empty();
    for (let [index, prescription] of medicines.entries()) {
        const selectId = `medicine-${index}`;
        const inputId = `frequency-${index}`;
        medicineList.append(`
            <div class="form-group form-row new-medicine">
                <div class="col-md-5">
                    <label for="${selectId}">Medicamento n° ${index + 1}</label>
                    <select class="form-control" id="${selectId}" name="${selectId}" onchange="updateMedicine(${index}, event.target.value)">
                        <option value="1">Medicamento 1</option>
                        <option value="2">Medicamento 2</option>
                        <option value="3">Medicamento 3</option>
                        <option value="4">Medicamento 4</option>
                        <option value="5">Medicamento 5</option>
                    </select>
                </div>
                <div class="col-md-5">
                <label for="${inputId}">Frequência n° ${index + 1}</label>
                <input class="form-control" id="${inputId}" name="${inputId}" onchange="updateFrequency(${index}, event.target.value)" value="${prescription.frequency || ''}" 
                    placeholder="Ex: Um comprimido de 8 e 8 horas" /> 
            </div>
                <div class="col-md-1 buttonWrapper">
                    <button class="addMedicineButton" onclick="addMoreMedicine()">
                        +
                    </button>
                </div>
                <div class="col-md-1 buttonWrapper">
                    <button class="removeMedicineButton" onclick="removeMedicine(${index})">
                        -
                    </button>
                </div>
            </div>
        `);
        $('#' + selectId).val(prescription.medicine).change();
    }
}

$(document).ready(function () {
    renderMedicine();
});
