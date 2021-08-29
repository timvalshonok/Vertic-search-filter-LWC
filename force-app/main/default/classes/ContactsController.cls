public with sharing class ContactsController {
    
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts() {
        return [
            SELECT Id, FirstName, LastName, Email, Account.Name, Phone, CreatedDate 
            FROM Contact
            WITH SECURITY_ENFORCED
            LIMIT 30
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Contact> searchByName(String strConName) {
        String key = '%' + strConName + '%';
        return [
            SELECT Id, FirstName, LastName, Email, Account.Name, Phone, CreatedDate 
            FROM Contact
            WHERE FirstName LIKE :key
            WITH SECURITY_ENFORCED
            LIMIT 30
        ];
    }
}
