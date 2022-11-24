package com.example.chatbot.ui.home;

import static android.content.ContentValues.TAG;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.RecyclerView;

import com.example.chatbot.R;
import com.example.chatbot.model.ModelContext;
import com.example.chatbot.ui.adapter.HomeAdapter;
import com.example.chatbot.ui.common.OnItemClickListener;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.Serializable;
import java.net.URISyntaxException;

import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;

public class HomeFragment extends Fragment {

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

    private ModelContext[] modelContexts;

    private Emitter.Listener onContext = new Emitter.Listener() {
        @Override
        public void call(final Object... args) {
            getActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    JSONObject data = (JSONObject) args[0];
                    JSONArray contextlist;
                    String status;
                    try {
                        contextlist = data.getJSONArray("data");
                        status = data.getString("status");
                    } catch (JSONException e) {
                        return;
                    }

                    // add the message to view
                    if (status.equals("true")) {
                        modelContexts = new ModelContext[contextlist.length()];
                        for(int i =0; i< contextlist.length();i++)
                        {
                            try {
                                JSONObject context = contextlist.getJSONObject(i);
                                JSONArray sugg = context.getJSONArray("suggested");
                                String[] sug = new String[sugg.length()];
                                for (int j =0; j<sugg.length();j++){
                                    sug[j]= sugg.getString(j);
                                }
                                ModelContext model = new ModelContext(context.getString("_id"),
                                        context.getString("userid"),context.getString("adminid"), sug);
                                modelContexts[i] = model;
                                Log.d("hello", model.getId());


                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                        }
                        OnItemClickListener<ModelContext> onClickListener = (view, context) -> {
                            Toast.makeText(getActivity().getApplicationContext(), context.getId(),
                                    Toast.LENGTH_LONG).show();
                            Intent intent = new Intent(getActivity(),ChatActivity.class);
                            intent.putExtra("context", (Serializable) context);
                            startActivity(intent);
                        };
                        RecyclerView recyclerView = getActivity().findViewById(R.id.rclViewChat);
                        HomeAdapter homeAdapter = new HomeAdapter(modelContexts, onClickListener);
                        recyclerView.setAdapter(homeAdapter);
                    }
                    else Toast.makeText(getActivity().getApplicationContext(), "không có context",
                            Toast.LENGTH_LONG).show();

                }
            });
        }
    };

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_home, container, false);
        FloatingActionButton button = root.findViewById(R.id.home_fab_add_product);
        View layout = root.findViewById(R.id.menu_home);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                SetVisibility(layout);
            }
        });
        Intent intent = getActivity().getIntent();
        String id = intent.getStringExtra("id");
        mSocket.connect();
        mSocket.emit("get_context",id);
        mSocket.on("data_context", onContext);

        return root;
    }

    void SetVisibility(View view)
    {
        if (view.getVisibility()== View.INVISIBLE)
            view.setVisibility(View.VISIBLE);
        else view.setVisibility(View.INVISIBLE);
    }

}
