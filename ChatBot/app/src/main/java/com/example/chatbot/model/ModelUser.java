package com.example.chatbot.model;

public class ModelUser {
    private String id;
    private String name;
    private String phone;
    private String mail;
    private String pass;

    public ModelUser(String id, String name, String phone, String mail, String pass) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.mail = mail;
        this.pass = pass;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getMail() {
        return mail;
    }

    public void setMail(String mail) {
        this.mail = mail;
    }

    public String getPass() {
        return pass;
    }

    public void setPass(String pass) {
        this.pass = pass;
    }
}
