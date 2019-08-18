export const cn = (...attrs) => [...attrs].filter(Boolean).join(' ');
export const cIf = (cl, c = true) => c ? cl : false;