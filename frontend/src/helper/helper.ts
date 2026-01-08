import { toast } from "sonner";

export function isDigit(str: string) {
  const rakamRegex = /^[0-9]*$/;
  return rakamRegex.test(str);
}

export function showErrors(error: any) {
  const message = error.response?.data?.message;

  if (Array.isArray(message)) {
    message.forEach((m: string) => {
      toast.error(m);
    });
  } else if (typeof message === 'string') {
    toast.error(message);
  } else {
    toast.error('Beklenmeyen bir hata oluştu');
  }
}

export function showSuccess(message: string) {
  toast.success(message);
}
