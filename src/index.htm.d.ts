import { Dialog, Button } from 'https://unpkg.com/@microsoft/fast-foundation@2.46.14'

declare global {
    interface Document
    {
        getElementById(elementId: "contactButton"): Button;
        getElementById(elementId: "contactDialog"): Dialog;
    }
}
