"use client";

import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Trie } from "@/lib/algorithms/trie"

export function ClientAutocomplete({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [trie, setTrie] = useState<Trie | null>(null)
  const [focused, setFocused] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch("/api/clients")
      .then((res) => res.json())
      .then((clients: { clientName: string }[]) => {
        const t = new Trie()
        for (const c of clients) {
          t.insert(c.clientName)
        }
        setTrie(t)
      })
  }, [])

  useEffect(() => {
    if (trie && value.trim().length > 0) {
      setSuggestions(trie.search(value.trim()))
    } else {
      setSuggestions([])
    }
  }, [value, trie])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setFocused(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        placeholder={placeholder || "Client Name"}
      />
      {focused && suggestions.length > 0 && (
        <Card className="absolute z-50 top-full mt-1 w-full p-1 shadow-lg max-h-48 overflow-y-auto">
          {suggestions.map((name) => (
            <button
              key={name}
              type="button"
              className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-accent transition-colors"
              onClick={() => {
                onChange(name)
                setFocused(false)
              }}
            >
              {name}
            </button>
          ))}
        </Card>
      )}
    </div>
  )
}
