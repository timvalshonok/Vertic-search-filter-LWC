public with sharing class ContactsController {
    
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

    @AuraEnabled
    public static void deleteContacts(Id id) {
        List<Contact> contact = [SELECT Id, Name FROM Contact WHERE Id = :id];
        try {
            delete contact;
        }
        catch(Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        return [SELECT Id, Name FROM Account];
    }

    @AuraEnabled(cacheable=false)
    public static Contact addNewRecord (Contact newRecord) {
        insert newRecord;
        return newRecord;
    }
}
