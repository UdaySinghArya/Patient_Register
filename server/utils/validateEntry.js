const NAME_MIN = 2;
const NAME_MAX = 80;
const ADDR_MIN = 3;
const ADDR_MAX = 120;
const MED_MIN = 2;
const MED_MAX = 300;
const AMOUNT_MAX = 100000;

function trimString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function parseAmount(raw) {
  if (typeof raw === 'number') {
    if (!Number.isFinite(raw)) return { error: 'Amount must be a number' };
    raw = String(raw);
  }
  if (typeof raw !== 'string') return { error: 'Amount is required' };

  const s = raw.trim();
  if (!s) return { error: 'Amount is required' };
  if (!/^\d+(\.\d{1,2})?$/.test(s)) {
    return { error: 'Amount must be greater than 0 with at most 2 decimal places' };
  }

  const n = Number(s);
  if (!(n > 0)) return { error: 'Amount must be greater than 0' };
  if (n > AMOUNT_MAX) return { error: `Amount cannot exceed ${AMOUNT_MAX}` };
  return { value: n };
}

export function validateEntry(body) {
  const errors = {};
  const patientName = trimString(body?.patientName);
  const address = trimString(body?.address);
  const medicines = trimString(body?.medicines);

  if (!patientName) errors.patientName = 'Patient name is required';
  else if (patientName.length < NAME_MIN || patientName.length > NAME_MAX) {
    errors.patientName = `Patient name must be ${NAME_MIN}–${NAME_MAX} characters`;
  }

  if (!address) errors.address = 'Address is required';
  else if (address.length < ADDR_MIN || address.length > ADDR_MAX) {
    errors.address = `Address must be ${ADDR_MIN}–${ADDR_MAX} characters`;
  }

  if (!medicines) errors.medicines = 'Medicines are required';
  else if (medicines.length < MED_MIN || medicines.length > MED_MAX) {
    errors.medicines = `Medicines must be ${MED_MIN}–${MED_MAX} characters`;
  }

  const amountResult = parseAmount(body?.amount);
  if (amountResult.error) errors.amount = amountResult.error;

  return {
    errors,
    value: {
      patientName,
      address,
      medicines,
      amount: amountResult.value,
    },
  };
}
