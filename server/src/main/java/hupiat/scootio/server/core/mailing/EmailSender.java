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
	
    public static void sendConfirmationSuscribe(String mail) throws AddressException, MessagingException {
        String host = "smtp.gmail.com";
        final String username = "hugopiatlillo@gmail.com"; 
        final String password = "ptfg abgw qddh xidk";
        
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true"); // Pour TLS
        props.put("mail.smtp.host", host);
        props.put("mail.smtp.port", "587"); // Pour TLS

        Session session = Session.getInstance(props,
            new javax.mail.Authenticator() {
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(username, password);
                }
            });

        MimeMessage message = new MimeMessage(session);
        message.setFrom(new InternetAddress("no-reply@scootio.com"));
        message.setRecipients(
            Message.RecipientType.TO,
            InternetAddress.parse(mail)
        );
        message.setSubject("Scoot'io suscribing");
        message.setText("You have been suscribed to Scoot'io, if it wasn't you, can you please refers to the admin of app : \n https://github.com/hupiat/Scoot-io");

        Transport.send(message);
    }
}
