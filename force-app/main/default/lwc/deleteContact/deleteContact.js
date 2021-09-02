import { LightningElement, api } from 'lwc';

export default class DeleteContact extends LightningElement {

    @api showModal = false;
    @api row;

    @api openModal() {
        this.showModal = true;
    };

    @api closeModal() {
        this.showModal = false;
    }

    deleteContact(event) {
        this.row;
        console.log("deleteContact=>" +  event.target.dataset.rowId);
        const contactId = event.target.dataset.rowId;
        this.dispatchEvent(new CustomEvent('rerendercontacts',{
            detail: contactId
        }));
        console.log('deleteContact=>' + contactId);
        this.showModal = false;
    }
}