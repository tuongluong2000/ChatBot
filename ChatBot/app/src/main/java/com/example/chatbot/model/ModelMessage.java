package com.example.chatbot.model;

import java.sql.Timestamp;

public class ModelMessage {
    private String id;
    private String contextid;
    private String senderid;
    private String content;
    private Timestamp timestamp;

    public ModelMessage(String id, String contextid, String senderid, String content, Timestamp timestamp) {
        this.id = id;
        this.contextid = contextid;
        this.senderid = senderid;
        this.content = content;
        this.timestamp = timestamp;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getContextid() {
        return contextid;
    }

    public void setContextid(String contextid) {
        this.contextid = contextid;
    }

    public String getSenderid() {
        return senderid;
    }

    public void setSenderid(String senderid) {
        this.senderid = senderid;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Timestamp getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Timestamp timestamp) {
        this.timestamp = timestamp;
    }
}
