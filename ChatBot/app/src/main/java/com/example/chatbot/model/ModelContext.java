package com.example.chatbot.model;

public class ModelContext {
    private String id;
    private String userid;
    private String adminid;
    private String[] suggested;

    public ModelContext(String id, String userid, String adminid, String[] suggested) {
        this.id = id;
        this.userid = userid;
        this.adminid = adminid;
        this.suggested = suggested;
    }


    public String getAdminid() {
        return adminid;
    }

    public void setAdminid(String adminid) {
        this.adminid = adminid;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserid() {
        return userid;
    }

    public void setUserid(String userid) {
        this.userid = userid;
    }

    public String[] getSuggested() {
        return suggested;
    }

    public void setSuggested(String[] suggested) {
        this.suggested = suggested;
    }
}
