class TrieNode {
  children: Map<string, TrieNode> = new Map()
  isEnd: boolean = false
  value: string | null = null
}

export class Trie {
  private root = new TrieNode()

  insert(word: string) {
    let node = this.root
    for (const ch of word.toLowerCase()) {
      if (!node.children.has(ch)) {
        node.children.set(ch, new TrieNode())
      }
      node = node.children.get(ch)!
    }
    node.isEnd = true
    node.value = word
  }

  search(prefix: string, limit = 8): string[] {
    let node = this.root
    for (const ch of prefix.toLowerCase()) {
      if (!node.children.has(ch)) return []
      node = node.children.get(ch)!
    }
    const results: string[] = []
    this.collect(node, results, limit)
    return results
  }

  private collect(node: TrieNode, results: string[], limit: number) {
    if (results.length >= limit) return
    if (node.isEnd && node.value) {
      results.push(node.value)
    }
    for (const [, child] of node.children) {
      this.collect(child, results, limit)
      if (results.length >= limit) return
    }
  }
}
