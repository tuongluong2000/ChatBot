package com.example.chatbot.ui.common;

import android.view.View;

public interface OnItemClickListener<T> {
    void onItemClicked(View view, T data);
}