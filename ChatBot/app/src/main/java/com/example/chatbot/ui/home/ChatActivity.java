package com.example.chatbot.ui.home;

import static android.content.ContentValues.TAG;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.chatbot.R;
import com.example.chatbot.model.ModelContext;
import com.example.chatbot.model.ModelMessage;
import com.example.chatbot.ui.adapter.ChatAdapter;
import com.google.android.material.appbar.MaterialToolbar;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.net.URISyntaxException;
import java.sql.Timestamp;

import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;

public class ChatActivity extends AppCompatActivity {

    private final String URL_SERVER = "http://192.168.1.21:3000/";
    private Socket mSocket;

    {
        try {
            mSocket = IO.socket(URL_SERVER);
            Log.d(TAG, "connect");

        } catch (URISyntaxException e) {
            Log.d(TAG, "No connect");
            e.printStackTrace();
        }
    }

    private boolean statuss;
    private String userid;
    private ModelMessage[] messages;
    private ModelContext context;

    private Emitter.Listener onAdminMessage = new Emitter.Listener() {
        @Override
        public void call(final Object... args) {
            ChatActivity.this.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    JSONObject data = (JSONObject) args[0];
                    JSONArray messagelist;
                    String status;
                    String contextid;
                    try {
                        messagelist = data.getJSONArray("data");
                        status = data.getString("status");
                        contextid = data.getString("contextid");
                    } catch (JSONException e) {
                        return;
                    }
                    // add the message to view
                    if (status.equals("true")&&context.getId().equals(contextid)) {
                        messages = new ModelMessage[messagelist.length()];
                        for(int i =0; i< messagelist.length();i++)
                        {
                            try {
                                JSONObject mes = messagelist.getJSONObject(i);
                                ModelMessage model = new ModelMessage(mes.getString("_id"),mes.getString("contextid"),
                                        mes.getString("senderid"),mes.getString("content"),
                                        (mes.getString("timestamp")));
                                messages[i] = model;
                                Log.d("model", model.getId());


                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                        }
                        RecyclerView recyclerView = ChatActivity.this.findViewById(R.id.rclViewMessage);
                        ChatAdapter chatAdapter = new ChatAdapter(messages, userid,statuss);
                        recyclerView.setAdapter(chatAdapter);
                        recyclerView.setLayoutManager(new LinearLayoutManager(ChatActivity.this));
                        recyclerView.scrollToPosition(messages.length-1);
                    }
                    else Toast.makeText(ChatActivity.this.getApplicationContext(), "không có context",
                            Toast.LENGTH_LONG).show();

                }
            });
        }
    };

    private Emitter.Listener onMessage = new Emitter.Listener() {
        @Override
        public void call(final Object... args) {
            ChatActivity.this.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    JSONObject data = (JSONObject) args[0];
                    JSONArray messagelist;
                    String status;
                    try {
                        messagelist = data.getJSONArray("data");
                        status = data.getString("status");
                    } catch (JSONException e) {
                        return;
                    }
                    // add the message to view
                    if (status.equals("true")) {
                        messages = new ModelMessage[messagelist.length()];
                        for(int i =0; i< messagelist.length();i++)
                        {
                            try {
                                JSONObject mes = messagelist.getJSONObject(i);
                                ModelMessage model = new ModelMessage(mes.getString("_id"),mes.getString("contextid"),
                                        mes.getString("senderid"),mes.getString("content"),
                                        (mes.getString("timestamp")));
                                messages[i] = model;
                                Log.d("model", model.getId());


                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                        }
                        RecyclerView recyclerView = ChatActivity.this.findViewById(R.id.rclViewMessage);
                        ChatAdapter chatAdapter = new ChatAdapter(messages, userid,statuss);
                        recyclerView.setAdapter(chatAdapter);
                        recyclerView.setLayoutManager(new LinearLayoutManager(ChatActivity.this));
                        recyclerView.scrollToPosition(messages.length-1);
                    }
                    else Toast.makeText(ChatActivity.this.getApplicationContext(), "không có context",
                            Toast.LENGTH_LONG).show();

                }
            });
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chat);
        mSocket.connect();
        Intent intent = getIntent();
        context = (ModelContext) intent.getSerializableExtra("context");
        Toast.makeText(this, context.getId(), Toast.LENGTH_SHORT).show();
        userid = context.getUserid();
        MaterialToolbar toolbar = findViewById(R.id.topAppBar);
        if(context.getAdminid().equals("")){
            toolbar.setTitle("Bot");
            statuss = false;
        }
        else    {
            toolbar.setTitle("Admin");
            statuss = true;
        }
        mSocket.emit("get_message",context.getId());
        mSocket.on("data_message", onMessage);
        mSocket.on("user_admin_sent_data_message", onAdminMessage);

        toolbar.setNavigationOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent i = new Intent(ChatActivity.this, HomeActivity.class);
                i.putExtra("id",context.getUserid());
                startActivity(i);
            }
        });

        ImageButton imageButton = findViewById(R.id.sendButton);
        EditText editText = findViewById(R.id.textField);
        imageButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(!editText.getText().toString().equals("")){
                    mSocket.emit("send_message", context.getId(), userid,
                            editText.getText().toString(),
                            new Timestamp(System.currentTimeMillis()).toString(), toolbar.getTitle());
                    mSocket.on("data_sendmessage", onMessage);
                    editText.setText("");
                }
            }
        });

        RecyclerView recyclerView = findViewById(R.id.rclViewMessage);
        recyclerView.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrollStateChanged(@NonNull RecyclerView recyclerView, int newState) {
                super.onScrollStateChanged(recyclerView, newState);

            }
        });
        editText.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                recyclerView.scrollToPosition(messages.length-1);
            }
        });
    }
}
