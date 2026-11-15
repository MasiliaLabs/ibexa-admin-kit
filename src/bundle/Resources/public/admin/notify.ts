export type NoticeKind = 'success' | 'error' | 'info' | 'warning';

interface IbexaNotificationHelper {
    showSuccessNotification?: (message: string) => void;
    showErrorNotification?: (message: string) => void;
    showInfoNotification?: (message: string) => void;
    showWarningNotification?: (message: string) => void;
}

const HELPERS: Record<NoticeKind, keyof IbexaNotificationHelper> = {
    success: 'showSuccessNotification',
    error: 'showErrorNotification',
    info: 'showInfoNotification',
    warning: 'showWarningNotification',
};

/** Shows a toast through Ibexa's own notification helper (`ibexa.helpers.notification`), or its event when the helper is not there. */
export function notify(kind: NoticeKind, message: string): void {
    const helper = (globalThis as { ibexa?: { helpers?: { notification?: IbexaNotificationHelper } } }).ibexa?.helpers?.notification;
    const show = helper?.[HELPERS[kind]];
    if (typeof show === 'function') {
        show.call(helper, message);

        return;
    }
    document.body.dispatchEvent(new CustomEvent('ibexa-notify', { detail: { message, label: kind } }));
}
