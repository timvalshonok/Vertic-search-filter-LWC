import { LightningElement, api, wire, track } from 'lwc';
import getContacts from '@salesforce/apex/ContactsController.getContacts';
import searchByName from '@salesforce/apex/ContactsController.searchByName';
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class ContactsList extends LightningElement {
    
    @track columns = [{
            label: 'First Name',
            fieldName: 'FirstName',
            type: 'text'
        },
        {
            label: 'Last Name',
            fieldName: 'LastName',
            type: 'text'
        },
        {
            label: 'Email',
            fieldName: 'Email',
            type: 'email'
        },
        {   
            label: "Account Name",
            fieldName: "AccountId",
            type: "url",
            typeAttributes: {
                label: { fieldName: 'AccountName'},
            }
        },
        {
            label: 'Phone',
            fieldName: 'Phone',
            type: 'phone'
        },
        {
            label: 'Created Date',
            fieldName: 'CreatedDate',
            type: 'date',
            typeAttributes: {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        }
    ];
    
    @track rows;
    @wire(getContacts) 
    wiredAssets(result) {
        if (result.data) {
            this.rows = result.data.map(this.toContactRows);
        } else if (result.error) {
            this.showErrorToast(result.error.body.message);
            this.rows = undefined;
        }
    }

    strConName = '';
    @wire(searchByName, { strConName: '$strConName' })
    wiredAssets(result) {
        if (result.data) {
            this.rows = result.data.map(this.toContactRows);
        } else if (result.error) {
            this.showErrorToast(result.error.body.message);
            this.rows = undefined;
        }
    }

    toContactRows(row) {
        let contact = {
            ...row,
            AccountName: row.Account?.Name,
            AccountId: `/${row.AccountId}`
        };
        return contact;
    }

    handleKeyChange(event) {
        const value = this.template.querySelector('.input').value;
        this.strConName = value;
    }

    showErrorToast(message) {
        const event = new ShowToastEvent({
            title: "Error",
            variant: "error",
            message: message
        });
        this.dispatchEvent(event);
    }
}