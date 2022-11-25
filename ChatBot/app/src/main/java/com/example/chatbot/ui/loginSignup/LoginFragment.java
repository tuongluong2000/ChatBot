package com.example.chatbot.ui.loginSignup;

import static android.content.ContentValues.TAG;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;

import com.example.chatbot.R;
import com.example.chatbot.ui.home.HomeActivity;

import org.json.JSONException;
import org.json.JSONObject;

import java.net.URISyntaxException;

import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;

public class LoginFragment extends Fragment {

    private final String URL_SERVER = "http://192.168.1.11:3000/";
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

    private Emitter.Listener onLogin = new Emitter.Listener() {
        @Override
        public void call(final Object... args) {
            getActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    JSONObject data = (JSONObject) args[0];
                    String username;
                    String status;
                    try {
                        username = data.getString("user_name");
                        status = data.getString("status");
                    } catch (JSONException e) {
                        return;
                    }

                    // add the message to view
                    if (status.equals("true")) {
                        Toast.makeText(getActivity().getApplicationContext(), "Đăng nhập thành công",
                                Toast.LENGTH_LONG).show();
                        mSocket.disconnect();
                        Intent intent =  new Intent(getActivity(), HomeActivity.class);
                        intent.putExtra("id",username);
                        getActivity().finish();
                        startActivity(intent);
                    }
                    else Toast.makeText(getActivity().getApplicationContext(), "Sai mật khẩu hoặc tài khoản",
                            Toast.LENGTH_LONG).show();

                }
            });
        }
    };

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_login, container, false);

        mSocket.on("user_login_emit", onLogin);
        mSocket.connect();

        EditText phone = root.findViewById(R.id.login_mobile_edit_text);
        EditText pass = root.findViewById(R.id.login_password_edit_text);
        Button loginBtn = root.findViewById(R.id.login_login_btn);


        loginBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                mSocket.emit("user_login",phone.getText().toString(),pass.getText().toString());

            }
        });
        return root;
    }
}
