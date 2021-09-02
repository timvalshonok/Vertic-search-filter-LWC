@isTest
private class TestContactsController {

    @isTest public static void checkSearchByName_Positive() {
        String firstName = 'Jack';
        String lastName = 'Jackson';

        List<Contact> contact = new List<Contact>();
        contact.add(new Contact(FirstName = firstName, LastName = lastName));
        insert contact;

        Test.startTest();
        List<Contact> actual = ContactsController.searchByName(firstName);
        Test.stopTest();

        List<Contact> expected = [
        SELECT FirstName, LastName, Email, Account.Name, AccountId, Phone, CreatedDate 
        FROM Contact 
        WHERE FirstName LIKE :firstName];
        System.assertEquals(expected, actual, 'check');
    }

    @isTest public static void checkSearchByName_Negative() {
        String name = null;

        Test.startTest();
        List<Contact> actual = ContactsController.searchByName(name);
        Test.stopTest();

        List<Contact> expected = [
        SELECT FirstName, LastName, Email, Account.Name, AccountId, Phone, CreatedDate 
        FROM Contact 
        WHERE FirstName LIKE :name];
        System.assertEquals(expected, actual, 'check');
    }

    @isTest public static void checkDeleteContact_Positive() {
        String firstName = 'Jack';
        String lastName = 'Jackson';

        List<Contact> contact = new List<Contact>();
        contact.add(new Contact(FirstName = firstName, LastName = lastName));
        insert contact;

        Test.startTest();
        ContactsController.deleteContacts(contact[0].Id);
        Test.stopTest();

        List<Contact> actual = [
            SELECT FirstName, LastName FROM Contact WHERE FirstName = :firstName AND LastName = :lastName
        ];
        System.assert(actual.size() == 0, 'actual == null');
    }
    
    @isTest public static void checkDeleteContact_Negative() {
        String id = '0053x000005fKLmABC';
        String firstName = 'Jack';
        String lastName = 'Jackson';

        List<Contact> contact = new List<Contact>();
        contact.add(new Contact(FirstName = firstName, LastName = lastName));
        insert contact;

        Test.startTest();
        ContactsController.deleteContacts(id);
        Test.stopTest();

        List<Contact> actual = [
            SELECT FirstName, LastName FROM Contact WHERE FirstName = :firstName AND LastName = :lastName
        ];
        System.assertEquals(contact, actual);
    }

    @isTest public static void AddNewRecord_Positive() {
        String firstName = 'Jack';
        String lastName = 'Jackson';

        Contact contact = new Contact(FirstName = firstName, LastName = lastName);
                       
        Test.startTest();
        ContactsController.addNewRecord(contact);
        Test.stopTest();
       
        Contact expectedContact = [SELECT FirstName, LastName FROM Contact WHERE FirstName =:firstName AND LastName=:lastName];
        System.assertEquals(expectedContact, contact);
    }

    @isTest public static void checkGetAccounts_Positive() {
        List<Account> account = new List<Account>();
        account.add(new Account(Name = 'Test.'));
        insert account;

        Test.startTest();
        List<Account> actual = ContactsController.getAccounts();
        Test.stopTest();

        List<Account> expected = [SELECT Id, Name FROM Account];

        System.assertEquals(expected, actual);
    }
}
