package com.example.chatbot.ui.home;

import static android.content.ContentValues.TAG;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.chatbot.R;
import com.example.chatbot.model.ModelContext;
import com.google.android.material.appbar.MaterialToolbar;

import java.net.URISyntaxException;

import io.socket.client.IO;
import io.socket.client.Socket;

public class ChatActivity extends AppCompatActivity {

    private final String URL_SERVER = "http://192.168.1.40:3000/";
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

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chat);
        mSocket.connect();
        Intent intent = getIntent();
        ModelContext context = (ModelContext) intent.getSerializableExtra("context");
        Toast.makeText(this, context.getId(), Toast.LENGTH_SHORT).show();

        MaterialToolbar toolbar = findViewById(R.id.topAppBar);
        if(context.getAdminid().equals(""))
            toolbar.setTitle("Bot");
        else    toolbar.setTitle("Admin");
        toolbar.setNavigationOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent i = new Intent(ChatActivity.this, HomeActivity.class);
                i.putExtra("id",context.getUserid());
                startActivity(i);
            }
        });
    }
}
