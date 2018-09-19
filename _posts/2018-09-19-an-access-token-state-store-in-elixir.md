---
layout: post
title: "An access token state store in Elixir"
description: "Using GenServer to create an access token store."
category: TIL
tags: [til,elixir]
---

I've recently been working on a small project that uses OAuth for authentication, which is proving
to be a great approach for what I need it for. After I got the OAuth authentication layer working
through, I realised that I needed a place to store the hash of user data I receive back from the
OAuth provider, along with some kind of access token I can use to authenticate requests to my
GraphQL API. This post describes the state store I created to manage access tokens.

Elixir has a built in module for background processes called GenServer. I actually managed to
implement most of what I needed simply based on the excellent documentation. The API for my module
wasn't very complicated - I just needed to insert access tokens, destroy access tokens (for logout
and invalidation), and check whether a given token exists. 

The module ended up quite simple:

``` elixir

defmodule MyApp.Token.Repo do
  use GenServer
  @name __MODULE__

  # Client

  @doc """
  Start the token repo server

  ## Example

    iex> Repo.start_link(:repo_start_link_doctest)
    {:ok, pid}
  """
  def start_link(name \\ @name) do
    GenServer.start_link(name, [])
  end

  @doc """
  Insert a new token into the repo

  ## Example

    iex> {:ok, pid} = Repo.start_link(:repo_insert_doctest_1)
    iex> Repo.insert("abc123") 
    iex> :os.getstate(Repo)
    ["abc123"]
  """
  def insert(pid, token), do: GenServer.cast(pid, {:insert, token})
  def destroy(pid, token), do: GenServer.cast(pid, {:destroy, token})
  def exists?(pid, token), do: GenServer.call(pid, {:exists, token})

  # Server

  @impl true
  def init(tokens) do
    # This is the 'state' of the server
    {:ok, tokens}
  end

  @impl true
  def handle_cast({:insert, token}, state) do
    {:noreply, [token | state]
  end

  def handle_cast({:destroy, token}, state) do
    {:noreply, Enum.delete(state, token)}
  end

  @impl true
  def handle call({:exists, token), _from, state) do
    {:reply, Enum.member?(state, token), state}
  end
end
