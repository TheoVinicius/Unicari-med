let medicines = [{
    medicine: '',
    frequency: ''
}];

$("#medic-form").submit(function (e) {
    e.preventDefault();
    let values = {};
    $.each($('#medic-form').serializeArray(), function (i, field) {
        values[field.name] = field.value;
    });

    medicines = medicines.filter((medicine, index) => medicine.medicine || medicine.frequency);

    if (medicines.length === 0) {
        medicines = [{
            medicine: '',
            frequency: ''
        }];
        return alertWarning('É preciso ter ao menos um medicamento adicionado ao receituário médico.');
    }

    renderMedicine();

    if (medicines.length === 0) {
        return alertWarning('É preciso ter ao menos um medicamento adicionado ao receituário médico.');
    }

    if (!medicines.every(medicine => medicine.medicine && medicine.frequency)) {
        return alertWarning('É preciso informar o nome e a frequência de todos os medicamentos adicionados.');
    }

    if (!values.patientName) {
        return alertWarning('É preciso informar o nome do paciente.');
    }

    if (!values.patientCellphone) {
        return alertWarning('É preciso informar o telefone do paciente.');
    }

    if (!values.patientEmail) {
        return alertWarning('É preciso informar o e-mail do paciente.');
    }

    showConfirmModal(values);
});



function addMoreMedicine() {
    medicines.push({
        medicine: '',
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
        heightAuto: false,
        confirmButtonColor: 'rgb(157, 27, 27)'
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
                    <input type="text" class="form-control" id="${selectId}" name="${selectId}" onchange="updateMedicine(${index}, event.target.value)" value="${prescription.medicine || ''}" />
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
    }
}

async function showConfirmModal(data) {
    const response = await Swal.fire({
        title: 'Confirmação',
        text: 'Deseja gerar o receituário médico?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Gerar receituário',
        cancelButtonText: 'Cancelar',
        heightAuto: false,
        confirmButtonColor: 'rgb(157, 27, 27)',
        reverseButtons: true
    });

    if (response.isConfirmed) {
        return generateMedicine(data);
    }
}

function generateMedicine(data) {
    const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true
    });
    pdf.setFontSize(24);
    pdf.text("Receituário", 85, 20, {
        align: "center"
    });
    pdf.setFontSize(12);
    pdf.text(`Rio de Janeiro, ${new Date().toLocaleDateString()}`, 20, 40);
    pdf.setFont(undefined, 'bold');
    pdf.text(`Paciente: ${data.patientName}`, 20, 46);
    pdf.text('Uso oral', 20, 57);
    pdf.setFont(undefined, 'normal');
    for (let [index, prescription] of medicines.entries()) {
        pdf.text(`${prescription.medicine} ......................................................................... ${prescription.frequency}`, 20, 75 + (index * 8));
    }
    pdf.setFont(undefined, 'bold');
    pdf.text('Uso contínuo', 20, 85 + (medicines.length * 8) + 10);
    pdf.text('____________________________________________', 20, 100 + (medicines.length * 8) + 20);
    pdf.text('Assinatura do médico - CRM', 20, 100 + (medicines.length * 8) + 30);
    pdf.setFont(undefined, 'normal');
    pdf.text('Carimbar com CRM', 20, 100 + (medicines.length * 8) + 40);
    pdf.save(`${data.patientName}_${new Date().getTime()}.pdf`);
}

$(document).ready(function () {
    renderMedicine();
});
