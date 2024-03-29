# edit markdown with livereload

## sentences

This is a sample text.

## graph by mermaid

```mermaid
graph LR
a --> b & c & d
b & c & d --> e
e --> f & g --> h
e --> i
i & h --> j
```

## tasks

- [x] this is done
- [ ] this should be done
- [ ] ~this is cancelled~

## codes

### python

```python
def f(x, y):
  return x + y
```

### c++

```c++
int f(int x, int y){
  return x + y;
}
```

### typescript

``` typescript
const f = (x: number, y: number): number => {
    return x + y;
}
```

## table

| item1 | item2 |
|-------|-------|
| hoge  | fuga  |

## math

The pdf of normal distribution is $\frac{1}{\sqrt{2 \pi \sigma^2}} \exp\left(-\frac{(x-\mu)^2}{2\sigma^2}\right)$.

It can be seen in equation mode.

$$
\frac{1}{\sqrt{2 \pi \sigma^2}} \exp\left(-\frac{(x-\mu)^2}{2\sigma^2}\right)
$$

## picture

![cat](./cat1.jpg)
