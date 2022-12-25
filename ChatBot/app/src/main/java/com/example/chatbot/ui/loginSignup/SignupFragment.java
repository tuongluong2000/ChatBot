package com.example.chatbot.ui.loginSignup;

import static android.content.ContentValues.TAG;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

import com.example.chatbot.R;

import org.json.JSONException;
import org.json.JSONObject;

import java.net.URISyntaxException;

import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;

public class SignupFragment extends Fragment {

    private String URL_SERVER = "";
    private Socket mSocket;

    private void Connection(){
        try {
            Bundle bundle = this.getArguments();
            if (bundle != null) {
                URL_SERVER = bundle.getString("url");
                Log.d("URL",URL_SERVER);
            }
            mSocket = IO.socket(URL_SERVER);
            Log.d(TAG, "connect");

        } catch (URISyntaxException e) {
            Log.d(TAG, "No connect");
            e.printStackTrace();
        }
    }

    private Emitter.Listener onSignup = new Emitter.Listener() {
        @Override
        public void call(final Object... args) {
            getActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    JSONObject data = (JSONObject) args[0];
                    String status;
                    try {
                        status = data.getString("status");
                    } catch (JSONException e) {
                        return;
                    }

                    // add the message to view
                    if (status.equals("true")) {
                        Toast.makeText(getActivity().getApplicationContext(), "Đăng ký thành công",
                                Toast.LENGTH_LONG).show();
                        mSocket.disconnect();
                        Fragment fragment = new LoginFragment();
                        FragmentTransaction transaction = getActivity().getSupportFragmentManager().beginTransaction();
                        transaction.replace(R.id.nav_host_fragment,fragment);
                        transaction.commit();
                    }
                    else Toast.makeText(getActivity().getApplicationContext(), "Đăng ký không thành công",
                            Toast.LENGTH_LONG).show();

                }
            });
        }
    };

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
            View root = inflater.inflate(R.layout.fragment_signup, container, false);
            Connection();
            mSocket.connect();
            mSocket.on("user_signup",onSignup);
        EditText name = root.findViewById(R.id.signup_name_edit_text);
        EditText phone = root.findViewById(R.id.signup_mobile_edit_text);
        EditText mail = root.findViewById(R.id.signup_email_edit_text);
        EditText pass = root.findViewById(R.id.signup_password_edit_text);
        EditText cnfpass = root.findViewById(R.id.signup_cnf_password_edit_text);

        Button signup = root.findViewById(R.id.signup_signup_btn);
        signup.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(name.getText().toString().equals("")|| phone.getText().toString().equals("")||
                        mail.getText().toString().equals("") ||pass.getText().toString().equals("")||cnfpass.getText().toString().equals("")) {
                    Toast.makeText(getActivity().getApplicationContext(),"Vui lòng điền đầy đủ thông tin",
                            Toast.LENGTH_LONG).show();
                }
                else {
                    if (!pass.getText().toString().equals(cnfpass.getText().toString())) {
                        Toast.makeText(getActivity().getApplicationContext(),"Mât khẩu không giống nhau",
                                Toast.LENGTH_LONG).show();
                    } else {
                        mSocket.emit("signup_user",name.getText().toString(),phone.getText().toString(),mail.getText().toString(),pass.getText().toString());
                    }
                }
            }
        });

        TextView signuplogin = root.findViewById(R.id.signup_login_text_view);
        signuplogin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                mSocket.disconnect();
                Fragment fragment = new LoginFragment();
                FragmentManager manager = getActivity().getSupportFragmentManager();
                FragmentTransaction transaction = manager.beginTransaction();
                transaction.replace(R.id.nav_host_fragment,fragment,null);
                transaction.commit();
            }
        });
            return root;
    }
}
