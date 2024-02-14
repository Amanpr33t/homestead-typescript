export interface AlertType {
    isAlertModal: boolean,
    alertType: 'success' | 'warning' | null,
    alertMessage: string | null,
    routeTo: string | null
}