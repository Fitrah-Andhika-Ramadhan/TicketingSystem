import Swal from 'sweetalert2';

// Pre-styled SweetAlert2 instance using TailwindCSS matching the Blue-White-Teal theme
export const swal = Swal.mixin({
  customClass: {
    popup: 'rounded-2xl border border-slate-100 shadow-2xl bg-white text-slate-800 font-sans p-6 max-w-sm md:max-w-md',
    title: 'text-slate-900 font-bold text-lg md:text-xl tracking-tight mb-2',
    htmlContainer: 'text-slate-500 text-sm leading-relaxed mb-4',
    confirmButton: 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg border-0 shadow-lg shadow-blue-500/10 active:scale-[0.98] transition cursor-pointer outline-none',
    cancelButton: 'bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold px-5 py-2.5 rounded-lg border-0 transition cursor-pointer outline-none ml-2.5',
    actions: 'flex justify-center items-center gap-1.5 mt-2',
    icon: 'scale-90 md:scale-100 mb-1 border-0',
  },
  buttonsStyling: false,
});

export default swal;
