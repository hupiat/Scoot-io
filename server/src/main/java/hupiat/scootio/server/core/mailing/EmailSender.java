package hupiat.scootio.server.core.mailing;

import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

public abstract class EmailSender {
	private static final String HOST = "smtp.gmail.com";
	private static final String USERNAME = "hugopiatlillo@gmail.com"; 
	private static final String PASSWORD = "ptfg abgw qddh xidk";
	
    public static void sendConfirmationSuscribe(String mail) throws AddressException, MessagingException {
    	Message message = getMessage();
        message.setRecipients(
            Message.RecipientType.TO,
            InternetAddress.parse(mail)
        );
        message.setSubject("Scoot'io suscribing");
        message.setText("You have been suscribed to Scoot'io, if it wasn't you, can you please refers to the admin of app : \n https://github.com/hupiat/Scoot-io");

        Transport.send(message);
    }
    
    public static void sendNewPasswordRetrieving(String mail, String password) throws AddressException, MessagingException {
    	Message message = getMessage();
        message.setRecipients(
            Message.RecipientType.TO,
            InternetAddress.parse(mail)
        );
        message.setSubject("Scoot'io password retrieval");
        message.setText("Your new Scoot'io password is : " + password + ", if it wasn't you, can you please refers to the admin of app : \n https://github.com/hupiat/Scoot-io");

        Transport.send(message);
    }
    
    private static Message getMessage() throws AddressException, MessagingException {
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", HOST);
        props.put("mail.smtp.port", "587");

        Session session = Session.getInstance(props,
            new javax.mail.Authenticator() {
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(USERNAME, PASSWORD);
                }
            });

        MimeMessage message = new MimeMessage(session);
        message.setFrom(new InternetAddress("no-reply@scootio.com"));
        return message;
    }
}
