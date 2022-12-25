package com.example.chatbot.ui.loginSignup;

import static android.content.ContentValues.TAG;

import android.os.Bundle;
import android.util.Log;

import androidx.appcompat.app.AppCompatActivity;

import com.example.chatbot.R;

import java.net.URISyntaxException;

import io.socket.client.IO;
import io.socket.client.Socket;

public class LoginSignupActivity extends AppCompatActivity {

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

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_signup);


    }
}
